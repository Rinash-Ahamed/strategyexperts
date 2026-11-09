import StaticImage from "@/components/shared/StaticImage";
import type { CSSProperties } from "react";
import Arrow from "@/components/shared/Arrow";
import Link from "@/components/shared/PageLink";
import { getPlatformLogos } from "@/lib/logo-library";
import type { Service } from "@/lib/site";
import type { ServiceDetails as Details } from "@/lib/service-details";
import styles from "./ServiceDetails.module.css";
import ServiceAudience from "./ServiceAudience";
import DigitalGrowthOrbit from "./DigitalGrowthOrbit";
import RestaurantReports from "./RestaurantReports";
import ServiceImpact from "./ServiceImpact";
import CommercePlatforms from "./CommercePlatforms";
import HospitalityPlatforms from "./HospitalityPlatforms";
import HotelPlatforms from "./HotelPlatforms";

const COMMERCE_ICONS = [
  "M8 20H4v-2a5 5 0 0 1 10 0v2h-2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m7 3 2 2 4-4",
  "m3 11 8-8h9v9l-8 8-9-9Zm12-4h.01M7 14l3 3",
  "M4 20V10h4v10m4 0V6h4v14m4 0V3M3 6l6-3 5 1 7-3",
  "M3 4h18v13H3V4Zm5 17h8m-4-4v4M6 13l4-4 4 2 4-5",
  "m4 10 13-6v16L4 14v-4ZM4 10H2v4h2m3 1 2 6h3l-2-5m10-7 2-1m-2 8 2 1",
];
const HOTEL_ICONS = [
  "M4 21V5l8-3 8 3v16M2 21h20M8 8h1m6 0h1M8 12h1m6 0h1M10 21v-5h4v5",
  "M4 5h16v16H4V5Zm3-3v6m10-6v6M4 10h16M8 14h2m4 0h2m-8 4h2",
  COMMERCE_ICONS[4],
  "M3 20h18M5 16l5-6 4 3 6-9m-6 0h6v6",
  COMMERCE_ICONS[3],
];
const DIGITAL_ICONS = [
  "M12 22s8-8 8-13a8 8 0 1 0-16 0c0 5 8 13 8 13Zm0-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z",
  "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm5-1.5L21 21",
  "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3a19 19 0 0 1 0 18 19 19 0 0 1 0-18Z",
  "M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-2a6 6 0 0 1 12 0v2m3-12h5m-2-2 2 2-2 2m-3 5h5m-2-2 2 2-2 2",
  "M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5a9 9 0 1 1 16.5-4.5ZM8 12h.01M12 12h.01M16 12h.01",
];
const RESTAURANT_ICONS = [
  "M3 20h18M5 15l5-5 4 3 6-9m-5 0h5v5",
  "M4 13v-3a8 8 0 0 1 16 0v3M4 10H2v7h5v-7H4Zm16 0h2v7h-5v-7h3Zm0 7v2l-6 2",
  "M12 3 3 7v5c0 5 9 10 9 10s9-5 9-10V7l-9-4Zm-4 9 3 3 5-6",
  COMMERCE_ICONS[3],
  DIGITAL_ICONS[1],
  "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l4 2",
  HOTEL_ICONS[1],
];

export default async function ServiceDetails({ service, content }: { service: Service; content: Details }) {
  const logos = await getPlatformLogos(service.theme, service.platforms);
  const contact = `/contact?service=${service.slug}`;
  const hotel = service.theme === "hotel";
  const digital = service.theme === "digital";
  const restaurant = service.theme === "restaurant";
  const commerce = service.theme === "ecom";
  const serviceIcons = restaurant ? RESTAURANT_ICONS : digital ? DIGITAL_ICONS : hotel ? HOTEL_ICONS : COMMERCE_ICONS;

  return (
    <div className={`wrap ${styles.content}`}>
      <section className={`${styles.hero}${hotel ? ` ${styles.reversed}` : ""}`} aria-labelledby="service-heading">
        <div className={styles.intro}>
          <p className={styles.badge}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M8 1.5 9.7 6.3 14.5 8l-4.8 1.7L8 14.5 6.3 9.7 1.5 8l4.8-1.7L8 1.5Z" fill="currentColor" /></svg>
            <span>{content.badge}</span>
          </p>
          <h1 id="service-heading">{content.headline} <span className={styles.accent}>{content.accent}</span></h1>
          <p className={styles.lead}>{content.intro}</p>
          <div className={styles.actions}>
            <Link href={contact} className="btn btn-light">Get a Free Consultation <Arrow /></Link>
            <a href="#service-support" className={styles.explore}><span className={styles.exploreLabel}>Explore Our Services</span> <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className={`${styles.platforms}${digital ? ` ${styles.digitalPlatforms}` : ""}${restaurant || hotel ? ` ${styles.hospitalityPlatforms}` : ""}`} data-service-platforms data-motion-region>
          {commerce ? <CommercePlatforms logos={logos} title={content.platformsTitle} /> : restaurant ? <HospitalityPlatforms logos={logos} title={content.platformsTitle} /> : hotel ? <HotelPlatforms logos={logos} title={content.platformsTitle} /> : <>
          {digital ? <div className={styles.orbit}><DigitalGrowthOrbit /></div> : <p className={styles.platformsTitle}>{content.platformsTitle}</p>}
          <ul className={styles.logos} aria-label={`${service.name} platforms`}>
            {logos.map((logo, index) => (
              <li className={styles.logo} key={logo.src} style={{ "--phase": `${-index * 1.3}s` } as CSSProperties}>
                <span className={styles.logoArt}>
                  <StaticImage src={logo.src} alt={logo.name} fill quality={90} slotWidth={digital ? 64 : 132} loading="eager" fetchPriority="low" sizes={digital ? "64px" : "(max-width: 599px) 112px, 132px"} />
                </span>
              </li>
            ))}
          </ul>
          </>}
        </div>
      </section>

      <div className={styles.body}>
        <section id="service-support" className={styles.section} aria-labelledby="support-heading">
          <header className={styles.sectionHeader}>
            <p className={styles.category}>Our Services</p>
            <h2 id="support-heading">{content.servicesTitle}</h2>
            <p>{content.servicesIntro}</p>
          </header>
          <ul className={`${styles.support}${content.services.length === 6 ? ` ${styles.supportSix}` : content.services.length === 7 ? ` ${styles.supportSeven}` : ""}`}>
            {content.services.map((item, index) => (
              <li key={item.title}>
                <span className={styles.supportIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d={serviceIcons[index]} /></svg>
                </span>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="benefits-heading">
          <header className={styles.sectionHeader}>
            <p className={styles.category}>Why Partner With Us?</p>
            <h2 id="benefits-heading">{content.benefitsTitle}</h2>
            <p>{content.benefitsIntro}</p>
            {content.benefitsContext && <p>{content.benefitsContext}</p>}
          </header>
          {restaurant && <RestaurantReports />}
          {content.benefits.length > 0 && <ul className={`${styles.benefitList}${content.benefits.length === 5 ? ` ${styles.benefitsFive}` : ""}`}>
            {content.benefits.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.body}</p></li>)}
          </ul>}
        </section>

        {content.impact && (
          <section className={styles.section} aria-labelledby="impact-heading">
            <header className={styles.sectionHeader}>
              <p className={styles.category}>Our Impact</p>
              <h2 id="impact-heading">Real Results for Restaurants Like Yours</h2>
            </header>
            <ServiceImpact items={content.impact} />
            <p className={styles.impactNote}>Results vary by business and engagement.</p>
          </section>
        )}

        <ServiceAudience title={content.audienceTitle} items={content.audience} theme={service.theme} />

        <section className={`${styles.section} ${styles.closing}`} aria-labelledby="service-closing-heading">
          <h2 id="service-closing-heading">{content.closingTitle}</h2>
          {content.closingBody && <p>{content.closingBody}</p>}
          <div className={styles.actions}>
            <Link href={contact} className="btn btn-light">Get a Free Consultation <Arrow /></Link>
            <Link href={contact} className={styles.explore}><span className={styles.exploreLabel}>Talk to a Growth Expert</span></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
