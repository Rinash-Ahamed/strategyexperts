import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { SERVICES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Discuss Your Business",
  description:
    "Tell Strategy Experts where your business is today. We’ll help you identify where the next opportunity lies.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="wrap">
      <div className="contact-grid">
        <div className="stack-m">
          <h1 className="h1">
            Ready to grow smarter?
          </h1>
          <p className="lead">
            Tell us where your business is today. We’ll help you identify where the next opportunity
            lies.
          </p>

            <ul className="channel-list" style={{ marginTop: 24 }}>
              <li>
                <span>Phone</span>
                <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
              </li>
              {SITE.whatsapp && (
                <li>
                  <span>WhatsApp</span>
                  <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    Message us
                  </a>
                </li>
              )}
              {SITE.emails.map((email) => (
                <li key={email}>
                  <span>Email</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              ))}
            </ul>
        </div>

        <ContactForm whatsapp={SITE.whatsapp} email={SITE.email} services={SERVICES.map(({ slug, name }) => ({ slug, name }))} />
      </div>
    </div>
  );
}
