import Image from "next/image";
import type { CSSProperties } from "react";
import { getPlatformLogos } from "@/lib/logo-library";
import { SERVICES, type ServiceTheme } from "@/lib/site";
import styles from "./Ticker.module.css";
import cycle from "./HeroServiceCycle.module.css";

const SERVICE_ORDER: ServiceTheme[] = ["restaurant", "hotel", "ecom", "digital"];
// Optical adjustments for padding inside the supplied logo files.
const LOGO_SCALE: Partial<Record<string, number>> = { Meta: 1.6, "Flipkart Minutes": 1.3 };
export default async function Ticker() {
  const groups = await Promise.all(SERVICE_ORDER.map(async theme => {
    const service = SERVICES.find(item => item.theme === theme)!;
    const platforms = await getPlatformLogos(theme, service.platforms);
    const copies = platforms.length ? Math.ceil(8 / platforms.length) : 0;
    return { ...service, platforms, conveyorPlatforms: Array.from({ length: copies }, () => platforms).flat() };
  }));
  return (
    <section className={styles.banner} aria-label="Our service platforms">
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.rail} />
        {groups.map((service, groupIndex) => (
          <div className={`${styles.service} ${cycle.phase}`} key={service.slug} style={{ "--group": groupIndex, "--count": service.conveyorPlatforms.length } as CSSProperties} data-platform-service={service.theme}>
            <p className={styles.label}>{service.navName}</p>
            <div className={styles.conveyor}>
              {service.conveyorPlatforms.map((asset, index) => {
                const { name } = asset;
                return (
                  <div className={styles.carrier} key={`${name}-${index}`} data-repeat={index >= service.platforms.length || undefined} style={{ "--slot": index } as CSSProperties}>
                    <span className={styles.logoFrame}>
                      <Image src={asset.src} fill unoptimized sizes="160px" alt="" className={styles.logo} style={{ transform: LOGO_SCALE[name] ? `scale(${LOGO_SCALE[name]})` : undefined }} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <ul className={styles.accessible}>
        {groups.map(service => <li key={service.slug}>{service.navName}: {service.platforms.map(asset => asset.name).join(", ")}</li>)}
      </ul>
      <p className={styles.note}>Platform expertise. Connected to your business.</p>
    </section>
  );
}
