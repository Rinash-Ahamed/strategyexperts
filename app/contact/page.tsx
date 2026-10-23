import type { Metadata } from "next";
import { Suspense } from "react";
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
          <h1 className="h1" style={{ fontSize: "clamp(2.6rem, 6.4vw, 5.6rem)" }}>
            Ready to grow smarter?
          </h1>
          <p className="lead">
            Tell us where your business is today. We’ll help you identify where the next opportunity
            lies.
          </p>

          {(SITE.whatsapp || SITE.email) && (
            <ul className="channel-list" style={{ marginTop: 24 }}>
              {SITE.whatsapp && (
                <li>
                  <span>WhatsApp</span>
                  <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    Message us
                  </a>
                </li>
              )}
              {SITE.email && (
                <li>
                  <span>Email</span>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </li>
              )}
            </ul>
          )}
        </div>

        <Suspense fallback={<div className="form" aria-busy="true" style={{ minHeight: 420 }} />}>
          <ContactForm whatsapp={SITE.whatsapp} email={SITE.email} services={SERVICES.map(({ slug, name }) => ({ slug, name }))} />
        </Suspense>
      </div>
    </div>
  );
}
