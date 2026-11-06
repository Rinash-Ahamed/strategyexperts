"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Adds `.in` to [data-reveal] elements as they enter the viewport. */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)")
    );
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Keep decorative loops alive only near the viewport. No scroll listeners
    // or React state updates are needed, and markup stays visible without JS.
    const regions = Array.from(document.querySelectorAll<HTMLElement>("[data-motion-region]"));
    const visible = new Set<Element>();
    const updateMotion = () => {
      for (const region of regions) {
        region.toggleAttribute("data-motion-paused", document.hidden || !visible.has(region));
      }
    };
    const motionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      updateMotion();
    }, { rootMargin: "200px" });
    regions.forEach(region => motionObserver.observe(region));
    document.addEventListener("visibilitychange", updateMotion);
    return () => {
      io.disconnect();
      motionObserver.disconnect();
      document.removeEventListener("visibilitychange", updateMotion);
      regions.forEach(region => region.removeAttribute("data-motion-paused"));
    };
  }, [pathname]);

  return null;
}
