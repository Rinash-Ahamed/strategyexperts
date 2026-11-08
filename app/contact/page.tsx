import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import BusinessHours from "@/components/shared/BusinessHours";
import { SERVICES, SITE } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Discuss Your Business",
  description:
    "Tell Strategy Experts where your business is today. We’ll help you identify where the next opportunity lies.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className={styles.page} data-motion-region>
      <div className="wrap">
      <div className="contact-grid">
        <div className={`stack-m ${styles.intro}`}>
          <h1 className="h1">
            Ready to <span className={styles.accent}>grow smarter?</span>
          </h1>
          <p className="lead">
            Tell us where your business is today. We’ll help you identify where the next opportunity
            lies.
          </p>

            <ul className="channel-list" style={{ marginTop: 24 }}>
              {SITE.phones.map(phone => (
                <li key={phone.number}>
                  <span>Phone</span>
                  <a href={`tel:${phone.number}`}>{phone.display}</a>
                </li>
              ))}
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

        <div className={styles.formColumn}>
          <BusinessHours />
          <ContactForm whatsapp={SITE.whatsapp} email={SITE.email} services={SERVICES.map(({ slug, name }) => ({ slug, name }))} />
        </div>
      </div>
      </div>
    </div>
  );
}
