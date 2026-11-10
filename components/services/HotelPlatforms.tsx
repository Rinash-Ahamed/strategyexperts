import type { LogoAsset } from "@/lib/logo-library";
import CommercePlatforms from "./CommercePlatforms";

/** Shared CSS-only pedestals, arranged for the hotel distribution channels. */
export default function HotelPlatforms({ logos, title }: { logos: LogoAsset[]; title: string }) {
  return <CommercePlatforms logos={logos} title={title} variant="hotel" />;
}
