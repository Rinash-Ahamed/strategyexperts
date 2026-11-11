import type { CSSProperties } from "react";
import StaticImage from "@/components/shared/StaticImage";
import type { LogoAsset } from "@/lib/logo-library";
import styles from "./CommercePlatforms.module.css";

// Reusable composition slots, not a logo inclusion list. Extra assets add a band.
const HOTEL_POSITIONS = [
  { x: 20, y: .56, scale: 1, layer: 3 },
  { x: 52, y: .62, scale: 1.04, layer: 3 },
  { x: 83, y: .49, scale: 1, layer: 3 },
  { x: 38, y: .27, scale: .88, layer: 2 },
  { x: 69, y: .20, scale: .88, layer: 2 },
  { x: 13, y: .08, scale: .76, layer: 1 },
  { x: 48, y: .01, scale: .76, layer: 1 },
];

/** A lightweight marketplace illustration; assets remain folder-driven. */
export default function CommercePlatforms({ logos, title, variant = "commerce" }: { logos: LogoAsset[]; title: string; variant?: "commerce" | "hotel" }) {
  const hotel = variant === "hotel";
  return (
    <figure className={`${styles.scene}${hotel ? ` ${styles.hotel}` : ""}`} data-commerce-platforms={!hotel || undefined} data-hotel-platforms={hotel || undefined} data-motion-region>
      <figcaption className={styles.caption}>{title}</figcaption>
      <div className={styles.stage}>
        <div className={styles.floor} aria-hidden="true" />
        <ul className={styles.platforms} aria-label={hotel ? "Hotel distribution platforms" : "E-Commerce Support platforms"} style={hotel ? { "--hotel-bands": Math.max(1, Math.ceil(logos.length / HOTEL_POSITIONS.length)) } as CSSProperties : undefined}>
          {logos.map((logo, index) => {
            const position = hotel ? HOTEL_POSITIONS[index % HOTEL_POSITIONS.length] : null;
            return (
            <li className={styles.platform} key={logo.src} style={{ "--delay": `${-index * 1.8}s`, ...(position ? { "--hotel-x": `${position.x}%`, "--hotel-y": position.y, "--hotel-scale": position.scale, "--hotel-layer": position.layer, "--hotel-band": Math.floor(index / HOTEL_POSITIONS.length) } : {}) } as CSSProperties}>
              <div className={styles.float}>
                <span className={styles.art}>
                  <StaticImage src={logo.src} variants={logo.variants} alt={logo.name} fill quality={90} slotWidth={hotel ? 112 : 132} loading="eager" fetchPriority="low" sizes={hotel ? "(max-width: 479px) 88px, 112px" : "(max-width: 479px) 88px, 132px"} />
                </span>
                {hotel ? (
                  <svg className={`${styles.plinth} ${styles.hexagon}`} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                    <defs>
                      <linearGradient id={`hotel-platform-surface-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop stopColor="#c8a0ff16" />
                        <stop offset="1" stopColor="#c8a0ff03" />
                      </linearGradient>
                    </defs>
                    <path d="M60 4 112 32 112 88 105 98 53 126 1 98 1 42 8 32Z" fill="#130e20" />
                    <path d="m60 116-52-28-7 10 52 28Z" fill="#0b0812" />
                    {/* An opaque top prevents side edges showing through. */}
                    <polygon points="60,4 112,32 112,88 60,116 8,88 8,32" fill="#0d0a13" />
                    <polygon points="60,4 112,32 112,88 60,116 8,88 8,32" fill={`url(#hotel-platform-surface-${index})`} stroke="#d8b9ff50" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                ) : <span className={styles.plinth} aria-hidden="true" />}
              </div>
            </li>
          );
          })}
        </ul>
        {!hotel && <div className={styles.business}>
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m16 3 12 7v13l-12 7L4 23V10L16 3Zm0 14 12-7M16 17 4 10m12 7v13M10 6.5l12 7v5" />
          </svg>
          <span>Your business</span>
        </div>}
      </div>
    </figure>
  );
}
