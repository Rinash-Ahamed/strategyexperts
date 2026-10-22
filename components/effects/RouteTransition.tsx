"use client";

import { useLayoutEffect, useRef } from "react";

const DURATION_MS = 520;
const REVEAL_MS = 220;
const STROKE_WIDTH = 700;
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
    const lengths = paths.map((path) => path.getTotalLength());
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animations: Animation[] = [];
    let active = true;

    const setHidden = () => {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      paths.forEach((path, index) => {
        path.style.strokeDasharray = String(lengths[index]);
        path.style.strokeDashoffset = String(lengths[index]);
        path.style.opacity = "1";
      });
      overlay.style.opacity = "1";
      overlay.dataset.state = "idle";
      document.documentElement.classList.remove("route-arrival");
      document.documentElement.removeAttribute("data-route-transition");
    };

    const revealArrival = async () => {
      overlay.dataset.state = "arrival";
      document.documentElement.setAttribute("data-route-transition", "true");
      document.documentElement.classList.remove("route-arrival");
      const animation = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: REVEAL_MS,
        easing: "ease-out",
        fill: "forwards",
      });
      animations = [animation];
      try {
        await animation.finished;
      } catch {
        // A superseded animation needs no recovery.
      }
      if (active) setHidden();
    };

    const sweepIn = async () => {
      overlay.dataset.state = "covering";
      document.documentElement.setAttribute("data-route-transition", "true");
      animations = paths.map((path, index) =>
        path.animate(
          [
            { strokeDashoffset: String(lengths[index]) },
            { strokeDashoffset: "0" },
          ],
          {
            duration: DURATION_MS,
            easing: "cubic-bezier(.76, 0, .24, 1)",
            fill: "forwards",
          }
        )
      );
      await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
      if (!active) return;
      paths.forEach((path) => (path.style.opacity = "0"));
      overlay.dataset.state = "black";
    };

    setHidden();

    let arriving = false;
    try {
      arriving = sessionStorage.getItem(STORAGE_KEY) === "1";
      if (arriving) sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }

    if (arriving && !reducedMotion.matches) {
      void revealArrival();
    } else {
      document.documentElement.classList.remove("route-arrival");
    }

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
      void (async () => {
        await sweepIn();
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

    return () => {
      active = false;
      animations.forEach((animation) => animation.cancel());
      document.removeEventListener("click", onClick, true);
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
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            style={{ strokeDasharray: 99999, strokeDashoffset: 99999 }}
          />
        ))}
      </svg>
    </div>
  );
}
