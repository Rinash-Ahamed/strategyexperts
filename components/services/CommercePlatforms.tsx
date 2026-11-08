import type { CSSProperties } from "react";
import StaticImage from "@/components/shared/StaticImage";
import type { LogoAsset } from "@/lib/logo-library";
import styles from "./CommercePlatforms.module.css";

/** A lightweight marketplace illustration; assets remain folder-driven. */
export default function CommercePlatforms({ logos, title }: { logos: LogoAsset[]; title: string }) {
  return (
    <figure className={styles.scene} data-commerce-platforms data-motion-region>
      <figcaption className={styles.caption}>{title}</figcaption>
      <div className={styles.stage}>
        <div className={styles.floor} aria-hidden="true" />
        <ul className={styles.platforms} aria-label="E-Commerce Support platforms">
          {logos.map((logo, index) => (
            <li className={styles.platform} key={logo.src} style={{ "--delay": `${-index * 1.8}s` } as CSSProperties}>
              <div className={styles.float}>
                <span className={styles.art}>
                  <StaticImage src={logo.src} alt={logo.name} fill quality={90} slotWidth={132} loading="eager" fetchPriority="low" sizes="(max-width: 479px) 88px, 132px" />
                </span>
                <span className={styles.plinth} aria-hidden="true" />
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.business}>
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m16 3 12 7v13l-12 7L4 23V10L16 3Zm0 14 12-7M16 17 4 10m12 7v13M10 6.5l12 7v5" />
          </svg>
          <span>Your business</span>
        </div>
      </div>
    </figure>
  );
}
