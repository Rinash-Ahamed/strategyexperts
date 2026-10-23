import Link from "@/components/shared/PageLink";
import { SERVICES, SITE } from "@/lib/site";
import Wordmark from "./Wordmark";

export default function SiteFooter() {
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Wordmark small={false} />
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
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              </li>
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
