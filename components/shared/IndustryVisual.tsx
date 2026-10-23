import Image from "next/image";
import type { ServiceTheme } from "@/lib/site";
import PlatformMarks from "./PlatformMarks";
import styles from "./IndustryVisual.module.css";

const HOME_PHOTOS = {
  ecom: { src: "/images/industries/commerce.webp", alt: "Warehouse shelves organised for inventory and fulfilment", caption: "The operational detail behind every order." },
  restaurant: { src: "/images/industries/restaurant.webp", alt: "Contemporary restaurant dining room with warm wood and natural light", caption: "A stronger business behind every guest experience." },
  hotel: { src: "/images/industries/hotel.webp", alt: "Contemporary hotel bedroom with warm timber and blue accents", caption: "Thoughtful hospitality. Commercial clarity." },
};

const SERVICE_PHOTOS = {
  ecom: { src: "/images/industries/commerce-service.webp", alt: "Red and black shopping bags representing retail and online commerce" },
  restaurant: { src: "/images/industries/restaurant-service.webp", alt: "A carefully plated meal being served at a contemporary restaurant table" },
  hotel: { src: "/images/industries/hotel-service.webp", alt: "Poolside hotel terrace with timber architecture and warm evening light" },
};

export default function IndustryVisual({ theme, platforms, placement = "home" }: { theme: Exclude<ServiceTheme, "digital">; platforms: readonly string[]; placement?: "home" | "service" }) {
  const photo = { ...HOME_PHOTOS[theme], ...(placement === "service" ? SERVICE_PHOTOS[theme] : {}) };
  return (
    <div className={`${styles.visual} ${styles[theme]}`} data-industry-visual>
      <figure className={styles.photo}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={1200}
          height={900}
          sizes="(min-width: 960px) 46vw, 100vw"
          loading="eager"
          fetchPriority={placement === "service" ? "high" : "low"}
          data-industry-photo
          data-photo-placement={placement === "service" ? "hero" : "content"}
        />
        <figcaption><span>{photo.caption}</span><span>Industry imagery, not client work.</span></figcaption>
      </figure>
      <PlatformMarks platforms={platforms} disclaimer />
    </div>
  );
}
