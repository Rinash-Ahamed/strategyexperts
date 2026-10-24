"use client";

import Link from "@/components/shared/PageLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import styles from "./SiteHeader.module.css";

type Props = { links: { href: string; label: string }[]; name: string; tagline: string };

export default function SiteHeader({ links, name, tagline }: Props) {
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
      const targets = [burgerRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [])]
        .filter((element): element is HTMLButtonElement | HTMLAnchorElement => Boolean(element));
      const index = targets.indexOf(document.activeElement as HTMLButtonElement | HTMLAnchorElement);
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
  const linkHref = (href: string) => href === "/" ? homeHref : href;

  return (
    <>
      <header className={`nav ${styles.header}${scrolled || open ? " scrolled" : ""}`} style={open ? { background: "transparent", borderColor: "transparent", backdropFilter: "none" } : undefined}>
        <div className={`wrap nav-inner ${styles.inner}`}>
          <Link href={homeHref} aria-label={`${name} home`} style={{ position: "relative", zIndex: 120, color: open ? "#fff" : undefined }}>
            <Wordmark />
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
                {links.filter((link) => link.href.startsWith("/services/")).map((link) => (
                  <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined}>
                    <span>{link.label}</span><span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </details>
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
      </header>

      <div id="mobile-menu" ref={menuRef} className={`menu${open ? " open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          <ol>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={linkHref(l.href)} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="menu-foot">
          <Link href="/contact" className="btn btn-light" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Discuss Your Business <span className="arr" aria-hidden="true">→</span>
          </Link>
          <p className="muted" style={{ fontSize: ".85rem" }}>
            {name} - {tagline}
          </p>
        </div>
      </div>
    </>
  );
}
