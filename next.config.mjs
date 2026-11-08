/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Client artwork replacements use a file fingerprint to refresh optimized
    // copies. Only that library needs local image query strings.
    localPatterns: [
      { pathname: "/clients/**" },
      { pathname: "/Brand/**" },
      { pathname: "/**", search: "" },
    ],
    // Permit the default photo quality and crisp high-quality asset requests.
    qualities: [75, 90],
    // Match small logo slots, including their 2x variants, without changing CSS.
    imageSizes: [32, 48, 64, 96, 128, 160, 192, 256, 320, 384],
    formats: ["image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Only fingerprinted URLs are immutable. Bare filenames still revalidate
      // so replacing artwork and rebuilding never strands an old browser copy.
      ...["/Brand/:path*", "/clients/:path*"].map(source => ({ source, has: [{ type: "query", key: "v" }], headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] })),
    ];
  },
};
export default nextConfig;
