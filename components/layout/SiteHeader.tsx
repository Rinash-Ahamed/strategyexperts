"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";
import Wordmark from "./Wordmark";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--progress", max > 0 ? String(Math.min(1, y / max)) : "0");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={`nav${scrolled || open ? " scrolled" : ""}`} style={open ? { background: "transparent", borderColor: "transparent", backdropFilter: "none" } : undefined}>
        <div className="wrap nav-inner">
          <Link href="/" style={{ position: "relative", zIndex: 120, color: open ? "#fff" : undefined }}>
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="nav-links">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions" style={{ position: "relative", zIndex: 120 }}>
            <Link href="/contact" className="btn btn-primary nav-cta">
              Discuss Your Business <span className="arr" aria-hidden="true">→</span>
            </Link>
            <button
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
        <span className="progress" aria-hidden="true" />
      </header>

      <div id="mobile-menu" className={`menu${open ? " open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          <ol>
            {NAV_LINKS.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  <span>{String(i).padStart(2, "0")}</span>
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
            {SITE.name} — {SITE.tagline}
          </p>
        </div>
      </div>
    </>
  );
}
