import Link from "@/components/shared/PageLink";
import { SERVICES, SITE } from "@/lib/site";
import Wordmark from "./Wordmark";

export default function SiteFooter() {
  const whatsapp = SITE.whatsapp || SITE.phone.replace(/\D/g, "");
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/#" className="footer-brand-link" aria-label="Strategy Experts home">
              <Wordmark small={false} />
            </Link>
            <div className="footer-socials">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Strategy Experts on Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with Strategy Experts on WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z" />
                  <path d="m8.5 7-1 1.5c-.5 2.8 3.7 7 6.5 6.5l1.5-1-2-2-1.2.8a7.3 7.3 0 0 1-2.6-2.6L10.5 9Z" />
                </svg>
              </a>
            </div>
            <p>Strategy, expertise and execution for businesses ready to perform better.</p>
          </div>
          <nav aria-label="Services">
            <p className="footer-h">Services</p>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="footer-h">Get in touch</p>
            <ul>
              <li>
                <Link href="/contact">Discuss your business</Link>
              </li>
              {SITE.whatsapp && (
                <li>
                  <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </li>
              )}
              <li>
                <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
              </li>
              {SITE.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>Strategy · Expertise · Execution</span>
        </div>
      </div>
    </footer>
  );
}
