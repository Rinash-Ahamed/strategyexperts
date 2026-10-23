"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";

type Props = { links: { href: string; label: string }[]; name: string; tagline: string };

export default function SiteHeader({ links, name, tagline }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const progressRef = useRef<HTMLSpanElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [document.getElementById("main"), document.querySelector("footer")]
      .filter((element): element is HTMLElement => element instanceof HTMLElement);
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    const frame = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());
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
      burgerRef.current?.focus();
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={`nav${scrolled || open ? " scrolled" : ""}`} style={open ? { background: "transparent", borderColor: "transparent", backdropFilter: "none" } : undefined}>
        <div className="wrap nav-inner">
          <Link prefetch={false} href="/" style={{ position: "relative", zIndex: 120, color: open ? "#fff" : undefined }}>
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="nav-links">
            {links.map((l) => (
              <Link
                prefetch={false}
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions" style={{ position: "relative", zIndex: 120 }}>
            <Link prefetch={false} href="/contact" className="btn btn-primary nav-cta">
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
            {links.map((l, i) => (
              <li key={l.href}>
                <Link prefetch={false} href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  <span>{String(i).padStart(2, "0")}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="menu-foot">
          <Link prefetch={false} href="/contact" className="btn btn-light" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
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
