import Link from "next/link";
import { SERVICES, SITE } from "@/lib/site";
import Wordmark from "./Wordmark";

export default function SiteFooter() {
  const hasContact = SITE.email || SITE.whatsapp;
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
              {SITE.email && (
                <li>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </li>
              )}
            </ul>
            {!hasContact && (
              <p style={{ fontSize: ".85rem" }}>Use the contact page to start a conversation.</p>
            )}
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
