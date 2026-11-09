import type { CSSProperties } from "react";
import type { LogoAsset } from "@/lib/logo-library";
import StaticImage from "@/components/shared/StaticImage";
import styles from "./HotelPlatforms.module.css";
import HotelLogoDepth from "./HotelLogoDepth";

// Repeating spatial slots, not an asset inclusion list. Extra logos add a band.
const positions = [
  { x: .23, y: .12, depth: 12, scale: 1 },
  { x: .68, y: .16, depth: -16, scale: .87 },
  { x: .81, y: .36, depth: 18, scale: 1.04 },
  { x: .54, y: .52, depth: 8, scale: .94 },
  { x: .22, y: .55, depth: -12, scale: .87 },
  { x: .18, y: .78, depth: 16, scale: 1.04 },
  { x: .52, y: .88, depth: -16, scale: .86 },
  { x: .82, y: .78, depth: 10, scale: .96 },
];

export default function HotelPlatforms({ logos, title }: { logos: LogoAsset[]; title: string }) {
  return (
    <figure className={styles.scene} data-hotel-platforms data-motion-region>
      <figcaption className={styles.caption}>{title}</figcaption>
      <HotelLogoDepth>
        <ul className={styles.collection} aria-label="Hotel distribution platforms" style={{ "--bands": Math.max(1, Math.ceil(logos.length / positions.length)) } as CSSProperties}>
        {logos.map((logo, index) => {
          const slot = positions[index % positions.length];
          return (
          <li className={styles.channel} key={logo.src} style={{ "--delay": `${-index * 1.2}s`, "--x": slot.x, "--y": slot.y, "--depth": `${slot.depth}px`, "--scale": slot.scale, "--band": Math.floor(index / positions.length) } as CSSProperties}>
              <span className={styles.art}>
                <StaticImage src={logo.src} alt={logo.name} fill quality={90} slotWidth={132} loading="eager" fetchPriority="low" sizes="(max-width: 479px) 104px, 132px" />
              </span>
          </li>
          );
        })}
        </ul>
      </HotelLogoDepth>
    </figure>
  );
}
