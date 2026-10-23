import Image from "next/image";
import type { ServiceTheme } from "@/lib/site";
import PlatformMarks from "./PlatformMarks";
import styles from "./IndustryVisual.module.css";

const PHOTOS = {
  ecom: { src: "/images/industries/commerce.webp", alt: "Warehouse shelves organised for inventory and fulfilment", caption: "The operational detail behind every order." },
  restaurant: { src: "/images/industries/restaurant.webp", alt: "Contemporary restaurant dining room with warm wood and natural light", caption: "A stronger business behind every guest experience." },
  hotel: { src: "/images/industries/hotel.webp", alt: "Contemporary hotel bedroom with warm timber and blue accents", caption: "Thoughtful hospitality. Commercial clarity." },
};

export default function IndustryVisual({ theme, platforms, priority = false }: { theme: Exclude<ServiceTheme, "digital">; platforms: readonly string[]; priority?: boolean }) {
  const photo = PHOTOS[theme];
  return (
    <div className={`${styles.visual} ${styles[theme]}`} data-industry-visual>
      <figure className={styles.photo}>
        <Image src={photo.src} alt={photo.alt} width={1200} height={900} sizes="(min-width: 960px) 46vw, 100vw" priority={priority} />
        <figcaption><span>{photo.caption}</span><span>Industry imagery, not client work.</span></figcaption>
      </figure>
      <PlatformMarks platforms={platforms} disclaimer />
    </div>
  );
}
