import Image from "next/image";
import type { CSSProperties } from "react";
import { PLATFORM_ASSETS } from "@/lib/platform-assets";
import styles from "./IndustryVisual.module.css";

export default function PlatformMarks({ platforms, disclaimer = false }: { platforms: readonly string[]; disclaimer?: boolean }) {
  return (
    <div className={styles.platforms} data-platform-marks>
      <ul className={styles.logos} aria-label="Platforms supported by this service">
        {platforms.map((name) => {
          const asset = PLATFORM_ASSETS[name];
          return (
            <li key={name}>
              {asset ? <Image src={asset.src} width={asset.width} height={asset.height} sizes="140px" alt={name} style={{ "--logo-ratio": asset.width / asset.height } as CSSProperties} /> : name}
            </li>
          );
        })}
      </ul>
      {disclaimer && <p className={styles.disclaimer}>Platform references only. No affiliation, endorsement or certification is implied.</p>}
    </div>
  );
}
