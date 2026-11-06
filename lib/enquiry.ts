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
