import type { CSSProperties } from "react";
import type { LogoAsset } from "@/lib/logo-library";
import StaticImage from "@/components/shared/StaticImage";
import styles from "./HospitalityPlatforms.module.css";

export default function HospitalityPlatforms({ logos, title }: {
  logos: LogoAsset[];
  title: string;
}) {
  return (
    <figure className={`${styles.scene} ${styles.restaurant}`} data-hospitality-platforms="restaurant" data-motion-region>
      <figcaption className={styles.caption}>{title}</figcaption>
      <ul className={styles.gallery} aria-label="Restaurant consulting platforms">
        {logos.map((logo, index) => (
          <li className={styles.tile} key={logo.src} style={{ "--delay": `${-index * 1.4}s` } as CSSProperties}>
            <span className={styles.platter} aria-hidden="true" />
            <span className={styles.art}>
              <StaticImage src={logo.src} alt={logo.name} fill quality={90} slotWidth={132} loading="eager" fetchPriority="low" sizes="(max-width: 479px) 112px, 132px" />
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
