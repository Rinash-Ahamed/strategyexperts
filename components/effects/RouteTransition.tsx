"use client";

import { useLayoutEffect, useRef } from "react";

const DURATION_MS = 1000;
const STROKE_MIN = 200;
const STROKE_MAX = 700;
const STORAGE_KEY = "strategy-experts:route-transition";

const PATHS = [
  "M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262",
  "M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012",
];

export default function RouteTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const paths = Array.from(overlay.querySelectorAll<SVGPathElement>("path"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const warmed = new Set<string>();
    let frame = 0;
    let active = true;

    const setHidden = () => {
      cancelAnimationFrame(frame);
      paths.forEach((path) => {
        path.style.strokeDashoffset = "1";
        path.style.strokeWidth = String(STROKE_MIN);
      });
      overlay.style.opacity = "1";
      overlay.dataset.state = "idle";
      document.documentElement.classList.remove("route-arrival");
      document.documentElement.removeAttribute("data-route-transition");
    };

    // Match the supplied reference: quadratic ease-in/out, drawing and
    // thickening together, then erasing forwards while thinning on arrival.
    const brush = (direction: "in" | "out") => new Promise<void>((resolve) => {
      let started: number | undefined;
      const tick = (now: number) => {
        if (!active) { resolve(); return; }
        started ??= now;
        const progress = Math.min((now - started) / DURATION_MS, 1);
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - 2 * (1 - progress) * (1 - progress);
        const offset = direction === "in" ? 1 - eased : -eased;
        const width = direction === "in"
          ? STROKE_MIN + (STROKE_MAX - STROKE_MIN) * eased
          : STROKE_MAX - (STROKE_MAX - STROKE_MIN) * eased;
        for (const path of paths) {
          path.style.strokeDashoffset = String(offset);
          path.style.strokeWidth = String(width);
        }
        if (progress < 1) frame = requestAnimationFrame(tick);
        else resolve();
      };
      frame = requestAnimationFrame(tick);
    });

    const revealArrival = async () => {
      paths.forEach((path) => {
        path.style.strokeDashoffset = "0";
        path.style.strokeWidth = String(STROKE_MAX);
      });
      overlay.dataset.state = "arrival";
      document.documentElement.setAttribute("data-route-transition", "true");
      document.documentElement.classList.remove("route-arrival");
      // Let the destination's initial layout paint beneath the opaque cover.
      // Do not wait for the robot, remote assets, or window.load.
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (!active) return;
      await brush("out");
      if (active) {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
        setHidden();
      }
    };

    const drawBrush = async () => {
      overlay.dataset.state = "covering";
      document.documentElement.setAttribute("data-route-transition", "true");
      await brush("in");
      if (!active) return;
      overlay.dataset.state = "covered";
    };

    setHidden();

    let arriving = false;
    try {
      arriving = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }

    if (arriving && !reducedMotion.matches) {
      void revealArrival();
    } else {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
      document.documentElement.classList.remove("route-arrival");
    }

    const warmDocument = (anchor: HTMLAnchorElement) => {
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== location.origin || destination.pathname === location.pathname || warmed.has(destination.href) || anchor.hasAttribute("download") || anchor.dataset.noTransition !== undefined) return;
      // Native document prefetch only: navigation still loads a separate page.
      if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
      warmed.add(destination.href);
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "document";
      link.href = destination.href;
      document.head.appendChild(link);
    };
    const onIntent = (event: Event) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (anchor) warmDocument(anchor);
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      busyRef.current = false;
      setHidden();
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") || anchor.dataset.noTransition !== undefined) return;
      if (anchor.target && anchor.target !== "_self") return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const current = new URL(window.location.href);
      const sameDocument =
        destination.pathname === current.pathname && destination.search === current.search;
      if (sameDocument) return;
      if (busyRef.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (reducedMotion.matches) {
        window.location.assign(destination.href);
        return;
      }

      busyRef.current = true;
      warmDocument(anchor);
      void (async () => {
        await drawBrush();
        if (!active) return;
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          // The transition still works without the arrival reveal.
        }
        window.location.assign(destination.href);
      })();
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("focusin", onIntent);
      window.removeEventListener("pageshow", onPageShow);
      document.documentElement.removeAttribute("data-route-transition");
    };
  }, []);

  return (
    <div className="route-transition" data-state="idle" ref={overlayRef} aria-hidden="true">
      <svg viewBox="0 0 2453 2535" fill="none" preserveAspectRatio="none">
        {PATHS.map((path, index) => (
          <path
            d={path}
            key={path}
            stroke={index === 0 ? "#e5e5e5" : "#707070"}
            strokeWidth={STROKE_MIN}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        ))}
      </svg>
    </div>
  );
}
