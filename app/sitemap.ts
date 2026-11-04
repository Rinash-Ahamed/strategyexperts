import type { MetadataRoute } from "next";
import { SERVICES, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/contact",
    "/pricing",
    ...SERVICES.map((s) => `/services/${s.slug}`),
  ].map((p) => ({ url: `${SITE.url}${p}` }));
}
