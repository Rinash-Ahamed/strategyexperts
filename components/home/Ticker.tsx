import Image from "next/image";
import type { CSSProperties } from "react";
import { PLATFORM_ASSETS } from "@/lib/platform-assets";
import { SERVICES } from "@/lib/site";
import styles from "./Ticker.module.css";
import cycle from "./HeroServiceCycle.module.css";

const SERVICE_ORDER = ["restaurant", "hotel", "ecom", "digital"];
// Optical adjustments for padding inside the supplied logo files.
const LOGO_SCALE: Partial<Record<string, number>> = { Meta: 1.6, "Flipkart Minutes": 1.3 };
const GROUPS = SERVICE_ORDER.map((theme) => {
  const service = SERVICES.find((item) => item.theme === theme)!;
  // Repeat short sets along the arc to keep Hotel's existing visual density.
  const copies = Math.ceil(8 / service.platforms.length);
  return { ...service, conveyorPlatforms: Array.from({ length: copies }, () => service.platforms).flat() };
});

export default function Ticker() {
  return (
    <section className={styles.banner} aria-label="Our service platforms">
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.rail} />
        {GROUPS.map((service, groupIndex) => (
          <div className={`${styles.service} ${cycle.phase}`} key={service.slug} style={{ "--group": groupIndex, "--count": service.conveyorPlatforms.length } as CSSProperties} data-platform-service={service.theme}>
            <p className={styles.label}>{service.navName}</p>
            <div className={styles.conveyor}>
              {service.conveyorPlatforms.map((name, index) => {
                const asset = PLATFORM_ASSETS[name];
                return (
                  <div className={styles.carrier} key={`${name}-${index}`} data-repeat={index >= service.platforms.length || undefined} style={{ "--slot": index } as CSSProperties}>
                    <span className={styles.logoFrame}>
                      <Image {...asset} unoptimized sizes="160px" alt="" className={styles.logo} style={{ width: "100%", height: "100%", transform: LOGO_SCALE[name] ? `scale(${LOGO_SCALE[name]})` : undefined }} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <ul className={styles.accessible}>
        {GROUPS.map(service => <li key={service.slug}>{service.navName}: {service.platforms.join(", ")}</li>)}
      </ul>
      <p className={styles.note}>Platform expertise. Connected to your business.</p>
    </section>
  );
}
