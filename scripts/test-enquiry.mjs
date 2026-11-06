import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import { validateEnquiry, enquiryText } from "../lib/enquiry.ts";

const valid = { name: "Sample Visitor", email: "visitor@example.com", business: "Example Business", service: "Restaurant Consulting", message: "Please help improve our restaurant visibility.", source: "straty", consent: true, website: "" };

test("valid enquiries from both interfaces are normalized", () => {
  for (const source of ["straty", "contact"]) {
    const value = validateEnquiry({ ...valid, name: " Sample Visitor ", source });
    assert.equal(value.name, "Sample Visitor");
    assert.match(enquiryText(value), /Reply email: visitor@example.com/);
  }
});

test("rejects missing consent, invalid addresses, oversized fields and header injection", () => {
  for (const input of [null, [], {}, { ...valid, consent: false }, { ...valid, email: "invalid" }, { ...valid, email: "a@example.com\r\nBcc:x@example.com" }, { ...valid, name: "a\nb" }, { ...valid, message: "short" }, { ...valid, message: "a".repeat(3001) }, { ...valid, business: "a".repeat(121) }, { ...valid, website: "spam" }, { ...valid, source: "unknown" }]) {
    assert.equal(validateEnquiry(input), null);
  }
});

// Execute the real route with a fake SMTP adapter: never opens a network socket.
test("route gates origin, payload, configuration, SMTP results and repeated requests", async () => {
  const originalUser = process.env.GMAIL_SMTP_USER;
  const originalPass = process.env.GMAIL_SMTP_APP_PASSWORD;
  const delivered = [];
  let rejected = false;
  globalThis.__enquiryTestTransport = { createTransport: (config) => ({
    async sendMail(message) { delivered.push({ config, message }); if (rejected) return { accepted: [] }; return { accepted: ["team@example.com"] }; },
    close() {},
  }) };
  const dataUrl = (text) => "data:text/javascript;base64," + Buffer.from(text).toString("base64");
  try {
    let route = await readFile(new URL("../app/api/enquiry/route.ts", import.meta.url), "utf8");
    route = route.replace('import nodemailer from "nodemailer";', 'const nodemailer = globalThis.__enquiryTestTransport;');
    const enquiryModule = dataUrl(stripTypeScriptTypes(await readFile(new URL("../lib/enquiry.ts", import.meta.url), "utf8")));
    route = route.replace('"@/lib/enquiry"', JSON.stringify(enquiryModule));
    route = route.replace('import { SITE } from "@/lib/site";', 'const SITE = {url:"https://strategyexperts.in",emails:["team@example.com"]};');
    const { POST } = await import(dataUrl(stripTypeScriptTypes(route)));
    function request(body = valid, origin = "https://strategyexperts.in", type = "application/json") {
      return new Request("https://strategyexperts.in/api/enquiry", { method: "POST", headers: { origin, "content-type": type }, body: JSON.stringify(body) });
    }
    assert.equal((await POST(request(valid, "https://other.example"))).status, 403);
    assert.equal((await POST(request(valid, undefined, "text/plain"))).status, 415);
    assert.equal((await POST(request({ ...valid, consent: false }))).status, 400);
    assert.equal((await POST(request({ message: "x".repeat(17000) }))).status, 413);
    delete process.env.GMAIL_SMTP_USER; delete process.env.GMAIL_SMTP_APP_PASSWORD;
    assert.equal((await POST(request())).status, 503);
    assert.equal(delivered.length, 0);
    process.env.GMAIL_SMTP_USER = "sender@gmail.com";
    process.env.GMAIL_SMTP_APP_PASSWORD = "fake test password";
    assert.equal((await POST(request())).status, 200);
    assert.equal(delivered[0].config.host, "smtp.gmail.com");
    assert.equal(delivered[0].config.secure, true);
    assert.deepEqual(delivered[0].message.to, ["team@example.com"]);
    assert.equal(delivered[0].message.replyTo.address, valid.email);
    assert.equal(delivered[0].message.from.address, "sender@gmail.com");
    rejected = true;
    assert.equal((await POST(request({ ...valid, email: "second@example.com" }))).status, 502);
    rejected = false;
    await POST(request()); await POST(request());
    assert.equal((await POST(request())).status, 429);
  } finally {
    if (originalUser === undefined) delete process.env.GMAIL_SMTP_USER; else process.env.GMAIL_SMTP_USER = originalUser;
    if (originalPass === undefined) delete process.env.GMAIL_SMTP_APP_PASSWORD; else process.env.GMAIL_SMTP_APP_PASSWORD = originalPass;
    delete globalThis.__enquiryTestTransport;
  }
});
