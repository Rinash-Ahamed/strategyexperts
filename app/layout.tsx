import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./refinements.css";
import "./content-colour.css";
import "./typography.css";
import RevealObserver from "@/components/effects/RevealObserver";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { NAV_LINKS, SITE } from "@/lib/site";

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "200 800",
  // A late font swap moved service copy in the cold mobile audit. Preload the
  // face, but retain the metric-adjusted fallback if the network misses paint.
  display: "optional",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - Better strategy. Stronger business.`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} - Better strategy. Stronger business.`,
    description: SITE.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - Better strategy. Stronger business.`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{sessionStorage.removeItem('strategy-experts:route-transition')}catch(e){}",
          }}
        />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <SiteHeader links={NAV_LINKS} name={SITE.name} tagline={SITE.tagline} />
        <main id="main">{children}</main>
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
