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
    const tickers = Array.from(document.querySelectorAll<HTMLElement>(".ticker"));
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting && !document.hidden);
      });
    });
    tickers.forEach((ticker) => motionObserver.observe(ticker));
    const onVisibility = () => {
      tickers.forEach((ticker) => {
        if (document.hidden) ticker.dataset.visible = "false";
        else {
          motionObserver.unobserve(ticker);
          motionObserver.observe(ticker);
        }
      });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      motionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname]);

  return null;
}
