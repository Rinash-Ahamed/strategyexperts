import Link from "@/components/shared/PageLink";
import { SERVICES, SITE } from "@/lib/site";
import Wordmark from "./Wordmark";

export default function SiteFooter() {
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
            </div>
            <p>Strategy, expertise and execution for businesses ready to perform better.</p>
          </div>
          <nav aria-label="Services">
            <p className="footer-h">Services</p>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link prefetch={false} href={`/services/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="footer-h">Get in touch</p>
            <ul>
              <li>
                <Link prefetch={false} href="/contact">Discuss your business</Link>
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
