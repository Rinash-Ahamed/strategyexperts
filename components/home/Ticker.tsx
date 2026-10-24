import Image from "next/image";
import type { CSSProperties } from "react";
import { PLATFORM_ASSETS } from "@/lib/platform-assets";

const NAMES = [
  "Amazon", "Flipkart", "Meesho", "Zomato", "Swiggy",
  "MakeMyTrip", "Booking.com", "Agoda", "Goibibo", "Expedia",
  "Cleartrip", "EaseMyTrip", "Yatra", "Google", "Meta", "WhatsApp",
];

export default function Ticker() {
  const group = (hidden: boolean) => (
    <div className="ticker-group" aria-hidden={hidden || undefined}>
      {NAMES.map((n) => (
        <span key={n} className="ticker-logo">
          <Image {...PLATFORM_ASSETS[n]} sizes="140px" alt={hidden ? "" : n} style={{ "--logo-ratio": PLATFORM_ASSETS[n].width / PLATFORM_ASSETS[n].height } as CSSProperties} />
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker platform-ticker surface-ivory" role="region" aria-label="Platforms referenced in our services">
      <div className="ticker-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
