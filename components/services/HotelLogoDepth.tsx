"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./HotelPlatforms.module.css";

/** Pointer tilt is local to the illustration and never updates React state. */
export default function HotelLogoDepth({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    const enabled = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let x = 0;
    let y = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      stage.style.removeProperty("--hotel-tilt-x");
      stage.style.removeProperty("--hotel-tilt-y");
    };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = stage.getBoundingClientRect();
        const horizontal = Math.max(-1, Math.min(1, (x - bounds.left) / bounds.width * 2 - 1));
        const vertical = Math.max(-1, Math.min(1, (y - bounds.top) / bounds.height * 2 - 1));
        stage.style.setProperty("--hotel-tilt-x", `${-vertical * 3}deg`);
        stage.style.setProperty("--hotel-tilt-y", `${horizontal * 3}deg`);
      });
    };
    const sync = () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", reset);
      reset();
      if (enabled.matches) {
        stage.addEventListener("pointermove", move, { passive: true });
        stage.addEventListener("pointerleave", reset);
      }
    };
    sync();
    enabled.addEventListener("change", sync);
    return () => {
      enabled.removeEventListener("change", sync);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", reset);
      reset();
    };
  }, []);
  return <div ref={ref} className={styles.stage}>{children}</div>;
}
