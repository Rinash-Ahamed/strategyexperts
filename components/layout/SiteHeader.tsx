"use client";

import Link from "@/components/shared/PageLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import styles from "./SiteHeader.module.css";

type Props = { links: { href: string; label: string }[]; name: string; tagline: string };

const PRODUCT_URL = "https://dashboard.strategyexperts.in/login";
const SERVICE_PREVIEWS: Record<string, { description: string; icon: string }> = {
  "/services/e-commerce-support": { description: "Marketplace operations. Stronger sales.", icon: "M4 7h16l1 14H3L4 7Zm4 0V6a4 4 0 0 1 8 0v1M9 12h6" },
  "/services/restaurant-consulting": { description: "Better operations. Healthier margins.", icon: "M4 3v6a3 3 0 0 0 6 0V3M7 3v18M17 3v18m0-18c4 3 4 8 0 9" },
  "/services/hotel-revenue-management": { description: "Smarter pricing. Stronger revenue.", icon: "M4 21V5l8-3 8 3v16M2 21h20M8 8h1m6 0h1M8 12h1m6 0h1M10 21v-5h4v5" },
  "/services/digital-marketing": { description: "Search, social and meaningful growth.", icon: "m4 10 13-6v16L4 14v-4ZM4 10H2v4h2m3 1 2 6h3l-2-5m10-7 2-1m-2 8 2 1" },
};

export default function SiteHeader({ links, name }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const progressRef = useRef<HTMLSpanElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !servicesRef.current?.contains(event.target)) {
        servicesRef.current?.removeAttribute("open");
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !servicesRef.current?.open) return;
      servicesRef.current.open = false;
      servicesRef.current.querySelector("summary")?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let scrollRange = 0;
    let wasScrolled = false;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if ((y > 8) !== wasScrolled) {
        wasScrolled = y > 8;
        setScrolled(wasScrolled);
      }
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${scrollRange > 0 ? Math.min(1, y / scrollRange) : 0})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const resize = () => {
      scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      onScroll();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    resize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
      else servicesRef.current?.removeAttribute("open");
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const burger = burgerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [document.getElementById("main"), document.querySelector("footer")]
      .filter((element): element is HTMLElement => element instanceof HTMLElement);
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    const frame = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true }));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const targets = [burgerRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href], summary") ?? [])]
        .filter((element): element is HTMLElement => Boolean(element && element.getClientRects().length));
      const index = targets.indexOf(document.activeElement as HTMLElement);
      if (index === -1 || (event.shiftKey && index === 0) || (!event.shiftKey && index === targets.length - 1)) {
        event.preventDefault();
        targets[event.shiftKey ? targets.length - 1 : 0]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      burger?.focus({ preventScroll: true });
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const homeHref = pathname === "/" ? "#" : "/";
  const mobileLinks = [
    { href: PRODUCT_URL, label: "Product" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className={`nav ${styles.header}${scrolled || open ? " scrolled" : ""}`} data-menu-open={open || undefined} style={open ? { background: "transparent", borderColor: "transparent", backdropFilter: "none", WebkitBackdropFilter: "none" } : undefined}>
        <span className={styles.glass} aria-hidden="true" />
        <div className={`wrap nav-inner ${styles.inner}`}>
          <Link href={homeHref} aria-label={`${name} home`} style={{ position: "relative", zIndex: 120, color: open ? "#fff" : undefined }}>
            <Wordmark small={false} />
          </Link>

          <nav aria-label="Primary" className={`nav-links ${styles.desktop}`}>
            <Link href={homeHref} aria-current={pathname === "/" ? "page" : undefined}>Home</Link>
            <details
              className={styles.services}
              ref={servicesRef}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
              }}
            >
              <summary className={styles.trigger} data-active={pathname.startsWith("/services/") || undefined}>
                Services
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.2" /></svg>
              </summary>
              <div className={styles.panel}>
                {links.filter((link) => link.href.startsWith("/services/")).map((link) => {
                  const preview = SERVICE_PREVIEWS[link.href];
                  const descriptionId = `nav-service-${link.href.split("/").pop()}`;
                  return (
                    <Link key={link.href} href={link.href} aria-label={link.label} aria-describedby={preview ? descriptionId : undefined} aria-current={isActive(link.href) ? "page" : undefined}>
                      {preview && <span className={styles.previewIcon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d={preview.icon} /></svg></span>}
                      <span className={styles.previewCopy}>
                        <span className={styles.previewTitle}>{link.label}</span>
                        {preview && <span className={styles.previewDescription} id={descriptionId}>{preview.description}</span>}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </details>
            <Link href={PRODUCT_URL} target="_blank" rel="noopener noreferrer" aria-label="Product (opens in a new tab)">Product</Link>
            <Link href="/pricing" aria-current={isActive("/pricing") ? "page" : undefined}>Pricing</Link>
            <Link href="/contact" aria-current={isActive("/contact") ? "page" : undefined}>Contact</Link>
          </nav>

          <div className={`nav-actions ${styles.actions}`} style={{ position: "relative", zIndex: 120 }}>
            <Link href="/contact" className={`btn btn-primary nav-cta ${styles.cta}`}>
              Discuss Your Business <span className="arr" aria-hidden="true">→</span>
            </Link>
            <button
              ref={burgerRef}
              type="button"
              className="burger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              style={open ? { borderColor: "rgba(255,255,255,.4)" } : undefined}
            >
              <span style={open ? { background: "#fff" } : undefined} />
              <span style={open ? { background: "#fff" } : undefined} />
            </button>
          </div>
        </div>
        <span className="progress" ref={progressRef} aria-hidden="true" />
        <svg className={styles.curve} viewBox="0 0 1440 16" preserveAspectRatio="none" aria-hidden="true" focusable="false" style={open ? { display: "none" } : undefined}>
          <defs>
            <linearGradient id="navigation-arc-silver" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#929292" stopOpacity=".08" />
              <stop offset=".5" stopColor="#d9d9d9" stopOpacity=".45" />
              <stop offset="1" stopColor="#929292" stopOpacity=".08" />
            </linearGradient>
          </defs>
          <path d="M0 1 Q720 25 1440 1" fill="none" stroke="url(#navigation-arc-silver)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </header>

      <div id="mobile-menu" ref={menuRef} className={`menu ${styles.mobileMenu}${open ? " open" : ""}`} aria-hidden={!open} inert={!open} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <div className={styles.mobileSurface}>
        <nav aria-label="Mobile">
          <ul className={styles.mobileLinks}>
            <li><Link href={homeHref} aria-current={pathname === "/" ? "page" : undefined} onClick={() => setOpen(false)}>Home</Link></li>
            <li>
              <details className={styles.mobileServices} key={open ? "open" : "closed"} open={open && pathname.startsWith("/services/") ? true : undefined}>
                <summary data-active={pathname.startsWith("/services/") || undefined}>
                  Services
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="m4 5.5 3 3 3-3" stroke="currentColor" strokeWidth="1.3" /></svg>
                </summary>
                <ul className={styles.mobileServiceLinks}>
                  {links.filter(link => link.href.startsWith("/services/")).map(link => (
                    <li key={link.href}>
                      <Link href={link.href} aria-current={isActive(link.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={SERVICE_PREVIEWS[link.href]?.icon} /></svg>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            {mobileLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} target={l.href === PRODUCT_URL ? "_blank" : undefined} rel={l.href === PRODUCT_URL ? "noopener noreferrer" : undefined} aria-label={l.href === PRODUCT_URL ? "Product (opens in a new tab)" : undefined} aria-current={isActive(l.href) ? "page" : undefined} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.mobileFoot}>
          <Link href="/contact" className="btn btn-light" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Discuss Your Business <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        </div>
      </div>
    </>
  );
}
