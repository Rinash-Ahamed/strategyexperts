import { createHash } from "node:crypto";
import nodemailer from "nodemailer";
import { enquiryHtml, enquiryText, validateEnquiry } from "@/lib/enquiry";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

// Best-effort limits per server instance. Distributed deployments must also
// configure a shared rate limit/WAF at their ingress (see docs/email-setup.md).
const attempts = new Map<string, { count: number; until: number }>();
// Reuse authenticated connections within a warm process. Creating and closing
// a transport for every message repeats DNS/TCP/TLS/authentication work.
let transport: ReturnType<typeof nodemailer.createTransport> | undefined;
function getTransport(user: string, pass: string) {
  transport ??= nodemailer.createTransport({
    pool: true,
    maxConnections: 2,
    maxMessages: 30,
    maxRequeues: 1,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  return transport;
}
function allow(key: string, limit: number, duration: number) {
  const now = Date.now();
  for (const [entry, value] of attempts) if (value.until <= now) attempts.delete(entry);
  const current = attempts.get(key) ?? { count: 0, until: now + duration };
  if (current.count >= limit) return false;
  current.count++;
  attempts.set(key, current);
  return true;
}

function failure(error: string, status: number) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "900" } : {}) } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || ![new URL(request.url).origin, new URL(SITE.url).origin].includes(origin)) return failure("Please send your enquiry from this website.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return failure("Invalid request format.", 415);
  if (!allow("requests", 100, 15 * 60_000)) return failure("Too many requests. Please try again later.", 429);

  // Bound the actual stream as well as Content-Length; don't trust the header.
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return failure("Please complete the enquiry form.", 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) { await reader.cancel(); return failure("Your enquiry is too long.", 413); }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return failure("Please complete the enquiry form.", 400); }
  const enquiry = validateEnquiry(input);
  if (!enquiry) return failure("Please check your name, email, message and consent.", 400);

  const user = process.env.GMAIL_SMTP_USER?.trim();
  const pass = process.env.GMAIL_SMTP_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) return failure("Email is temporarily unavailable. Please contact us by phone or WhatsApp.", 503);

  const identity = createHash("sha256").update(enquiry.email.toLowerCase()).digest("hex");
  if (!allow(identity, 3, 15 * 60_000) || !allow("deliveries", 30, 60 * 60_000)) return failure("Too many enquiries. Please try again later or contact us directly.", 429);
  try {
    const result = await getTransport(user, pass).sendMail({
      from: { name: "Strategy Experts Website", address: user },
      to: SITE.emails,
      replyTo: { name: enquiry.name, address: enquiry.email },
      subject: `New ${enquiry.source === "straty" ? "Straty" : "website"} enquiry`,
      text: enquiryText(enquiry),
      html: enquiryHtml(enquiry, SITE.url),
    });
    if (!result.accepted.length) throw new Error("No recipients accepted");
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    // Never expose SMTP credentials, provider responses or enquiry data.
    console.error("Enquiry email delivery failed.");
    return failure("We couldn't send your enquiry. Please try again later or contact us directly.", 502);
  }
}
