import type { CSSProperties } from "react";
import type { LogoAsset } from "@/lib/logo-library";
import StaticImage from "@/components/shared/StaticImage";
import styles from "./HotelPlatforms.module.css";

export default function HotelPlatforms({ logos, title }: { logos: LogoAsset[]; title: string }) {
  return (
    <figure className={styles.scene} data-hotel-platforms data-motion-region>
      <figcaption className={styles.caption}>{title}</figcaption>
      <div className={styles.stage}>
        <svg className={styles.architecture} viewBox="0 0 160 360" fill="none" aria-hidden="true" focusable="false">
          <path className={styles.foundation} d="m14 310 65-30 68 30-68 34-65-34Z" />
          <g className={styles.tower}>
            <path d="m44 96 39-18 34 18v192l-34 18-39-18V96Z" fill="#100c18" />
            <path d="m44 96 39 18 34-18M83 114v192M44 96l39-18 34 18M55 91V69l28-13 23 12v23M66 63V42l17-8 13 7v22M83 34V17" />
            <path className={styles.windows} d="m55 128 16 7m-16 19 16 7m-16 19 16 7m-16 19 16 7m-16 19 16 7m25-112 10-5m-10 31 10-5m-10 31 10-5m-10 31 10-5m-10 31 10-5" />
            <path d="m71 298 .1-33 12 6 12-6v35" />
          </g>
        </svg>
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
