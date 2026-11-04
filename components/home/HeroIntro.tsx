import type { CSSProperties } from "react";
import Link from "@/components/shared/PageLink";
import { SERVICES, type ServiceTheme } from "@/lib/site";
import styles from "./HeroIntro.module.css";
import cycle from "./HeroServiceCycle.module.css";

const DETAILS: Record<ServiceTheme, { description: string; path: string }> = {
  restaurant: { description: "Stronger operations, better visibility and a more profitable restaurant.", path: "M4 3v6a3 3 0 0 0 6 0V3M7 3v18M17 3v18m0-18c4 3 4 8 0 9" },
  hotel: { description: "Hospitality expertise, smarter pricing and revenue-led distribution.", path: "M4 21V5l8-3 8 3v16M2 21h20M8 8h1m6 0h1M8 12h1m6 0h1M10 21v-5h4v5" },
  ecom: { description: "Marketplace management that connects your products with opportunity.", path: "M4 7h16l1 14H3L4 7Zm4 0V6a4 4 0 0 1 8 0v1M9 12h6" },
  digital: { description: "Google and Meta campaigns, built around visibility and meaningful growth.", path: "m4 10 13-6v16L4 14v-4ZM4 10H2v4h2m3 1 2 6h3l-2-5m10-7 2-1m-2 8 2 1" },
};
const ORDER: ServiceTheme[] = ["restaurant", "hotel", "ecom", "digital"];

export default function HeroIntro() {
  return (
    <div className={`wrap ${styles.intro}`}>
      <div className={styles.copy}>
        <h1 className={styles.heading} id="hero-title">
          <span className={styles.firstLine}>Empowering Businesses to</span>{" "}
          <span className={styles.statement}>Grow Smarter</span>
        </h1>
        <div className={styles.description}>
          <p>We help restaurants, hotels, and e-commerce businesses grow through strategic consulting, digital marketing, and tailored business solutions.</p>
          <p><strong>More than a service provider - your trusted partner in driving profitability and sustainable growth.</strong></p>
        </div>
        <Link href="/contact" className={`btn ${styles.cta}`}>Let’s Grow Together <span className="arr" aria-hidden="true">→</span></Link>
      </div>

      <nav className={styles.services} aria-label="Explore our services">
        <h2 className={styles.panelTitle}>Expertise that moves<br />your business forward.</h2>
        <ul className={styles.list}>
          {ORDER.map((theme, index) => {
            const service = SERVICES.find(item => item.theme === theme)!;
            return (
              <li className={styles.item} key={theme} style={{ "--group": index } as CSSProperties} data-hero-service={theme}>
                <span className={`${styles.highlight} ${cycle.phase}`} aria-hidden="true" />
                <Link className={styles.service} href={`/services/${service.slug}`}>
                  <span className={styles.icon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d={DETAILS[theme].path} /></svg>
                  </span>
                  <span className={styles.serviceCopy}><span className={styles.serviceTitle}>{service.navName}</span><span className={styles.serviceDescription}>{DETAILS[theme].description}</span></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
