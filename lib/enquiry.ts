export type Enquiry = {
  name: string;
  email: string;
  business: string;
  service: string;
  message: string;
  source: "contact" | "straty";
  consent: true;
};

export function validateEnquiry(input: unknown): Enquiry | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const data = input as Record<string, unknown>;
  const text = (key: string) => typeof data[key] === "string" ? data[key].trim() : "";
  const name = text("name"), email = text("email"), business = text("business");
  const service = text("service"), message = text("message");
  if (data.consent !== true || text("website") || !["contact", "straty"].includes(String(data.source))) return null;
  if (!name || name.length > 100 || /[\r\n]/.test(name)) return null;
  if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return null;
  if (business.length > 120 || service.length > 100 || /[\r\n]/.test(service)) return null;
  if (message.length < 10 || message.length > 3000) return null;
  return { name, email, business, service, message, source: data.source as Enquiry["source"], consent: true };
}

export function enquiryText(enquiry: Enquiry) {
  return [
    `New enquiry via ${enquiry.source === "straty" ? "Straty support buddy" : "contact form"}`,
    "",
    `Name: ${enquiry.name}`,
    `Reply email: ${enquiry.email}`,
    `Business: ${enquiry.business || "Not provided"}`,
    `Service: ${enquiry.service || "Not sure yet"}`,
    "",
    enquiry.message,
    "",
    "The customer consented to being contacted about this enquiry.",
  ].join("\n");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

/** Email-safe tables and inline styles; no remote images, fonts or scripts. */
export function enquiryHtml(enquiry: Enquiry, siteUrl: string) {
  const source = enquiry.source === "straty" ? "Straty support buddy" : "Contact form";
  const replyUrl = `mailto:${encodeURIComponent(enquiry.email)}`;
  const details = [
    ["Name", enquiry.name],
    ["Reply email", enquiry.email],
    ["Business", enquiry.business || "Not provided"],
    ["Service", enquiry.service || "Not sure yet"],
  ].map(([label, value]) => `<tr>
    <td width="100" valign="top" style="padding:14px 12px 14px 0;border-bottom:1px solid #29262f;color:#bfc0c2;font-size:13px;line-height:20px;">${label}</td>
    <td valign="top" style="padding:14px 0;border-bottom:1px solid #29262f;color:#f4f2ed;font-size:15px;line-height:22px;word-break:break-word;overflow-wrap:anywhere;">${label === "Reply email" ? `<a href="${replyUrl}" style="color:#d9bdff;text-decoration:underline;word-break:break-all;">${escapeHtml(value)}</a>` : escapeHtml(value)}</td>
  </tr>`).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>Strategy Experts - New enquiry</title></head>
<body bgcolor="#000000" style="margin:0;padding:0;background-color:#000000;color:#f4f2ed;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">New enquiry from ${escapeHtml(enquiry.name)} via ${source}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000;"><tr><td align="center" style="padding:28px 12px;">
  <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0c0b10" style="max-width:600px;background-color:#0c0b10;border:1px solid #34303c;border-radius:20px;border-spacing:0;">
    <tr><td height="4" bgcolor="#b38ae8" style="height:4px;font-size:0;line-height:0;background-color:#b38ae8;background-image:linear-gradient(90deg,#ede2ff,#b38ae8,#d9bdff);border-radius:20px 20px 0 0;">&nbsp;</td></tr>
    <tr><td style="padding:28px 24px 24px;border-bottom:1px solid #29262f;">
      <p style="margin:0;color:#f4f2ed;font-size:26px;line-height:32px;letter-spacing:-1px;">Strategy Experts</p>
      <p style="margin:8px 0 0;color:#bfc0c2;font-size:11px;line-height:18px;letter-spacing:2px;text-transform:uppercase;">Your Growth Partner</p>
    </td></tr>
    <tr><td style="padding:28px 24px 0;">
      <span style="display:inline-block;padding:6px 12px;border:1px solid #755b94;border-radius:999px;background-color:#21182e;color:#e2cbff;font-size:12px;line-height:18px;">${source}</span>
      <h1 style="margin:20px 0 8px;color:#f4f2ed;font-size:28px;line-height:34px;font-weight:500;letter-spacing:-1px;">New business enquiry.</h1>
      <p style="margin:0;color:#d9bdff;font-size:16px;line-height:25px;">Your next growth conversation starts here.</p>
    </td></tr>
    <tr><td style="padding:14px 24px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${details}</table></td></tr>
    <tr><td style="padding:24px;">
      <h2 style="margin:0 0 12px;color:#d9bdff;font-size:13px;line-height:20px;font-weight:500;letter-spacing:1px;text-transform:uppercase;">What they have in mind</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#15111d" style="background-color:#15111d;border:1px solid #382c47;border-radius:12px;"><tr><td style="padding:18px;color:#f4f2ed;font-size:15px;line-height:25px;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(enquiry.message).replace(/\r\n|\r|\n/g, "<br>")}</td></tr></table>
    </td></tr>
    <tr><td style="padding:0 24px 28px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:10px;mso-padding-alt:14px 22px;"><a href="${replyUrl}" style="display:inline-block;padding:14px 22px;color:#111111;font-size:14px;line-height:20px;font-weight:bold;text-decoration:none;border-radius:10px;">Reply to enquiry &rarr;</a></td></tr></table>
      <p style="margin:18px 0 0;color:#bfc0c2;font-size:12px;line-height:20px;">The customer consented to being contacted about this enquiry.</p>
    </td></tr>
    <tr><td style="padding:20px 24px;border-top:1px solid #29262f;">
      <p style="margin:0;color:#bfc0c2;font-size:12px;line-height:20px;">Received via ${source} on the Strategy Experts website.</p>
      <p style="margin:8px 0 0;"><a href="${escapeHtml(siteUrl)}" style="color:#d9bdff;font-size:12px;line-height:20px;text-decoration:underline;">Visit Strategy Experts</a></p>
    </td></tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
  </td></tr></table>
</body></html>`;
}
