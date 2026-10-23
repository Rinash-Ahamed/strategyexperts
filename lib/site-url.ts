const DEFAULT_SITE_URL = "https://strategyexperts.vercel.app";

/** Keep metadata, canonical URLs and the sitemap on the same valid origin. */
export function normalizeSiteUrl(value: string | undefined): string {
  const input = value?.trim();
  if (!input) return DEFAULT_SITE_URL;

  // A bare hostname (including localhost:3000) is not a URL scheme.
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(input);
  const isHostWithPort = /^[^/:?#\s]+:\d+(?:[/?#]|$)/.test(input);
  const candidate = input.startsWith("//")
    ? `https:${input}`
    : hasScheme && !isHostWithPort ? input : `https://${input}`;

  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
      return DEFAULT_SITE_URL;
    }
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
