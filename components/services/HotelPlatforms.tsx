import type { CSSProperties } from "react";
import type { LogoAsset } from "@/lib/logo-library";
import StaticImage from "@/components/shared/StaticImage";
import styles from "./HotelPlatforms.module.css";

export default function HotelPlatforms({ logos, title }: { logos: LogoAsset[]; title: string }) {
  return (
    <figure className={styles.scene} data-hotel-platforms data-motion-region>
      <figcaption className={styles.caption}>{title}</figcaption>
      <div className={styles.stage}>
        <ul className={styles.collection} aria-label="Hotel distribution platforms">
        {logos.map((logo, index) => (
          <li className={styles.channel} key={logo.src} style={{ "--delay": `${-index * 1.2}s` } as CSSProperties}>
              <span className={styles.art}>
                <StaticImage src={logo.src} alt={logo.name} fill quality={90} slotWidth={132} loading="eager" fetchPriority="low" sizes="(max-width: 479px) 104px, 132px" />
              </span>
          </li>
        ))}
        </ul>
      </div>
    </figure>
  );
}
