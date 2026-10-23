"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroHeadline.module.css";

const PHRASES = [
  "Measurable growth.",
  "Stronger outcomes.",
  "Smarter growth.",
  "Lasting impact.",
  "Better business.",
  "Real results.",
  "Greater potential.",
];

export default function HeroHeadline() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [animate, setAnimate] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!animate) return;
    let timer: number;
    const hold = () => {
      // Allow 200ms for the incoming fade, then hold fully visible for 1500ms.
      timer = window.setTimeout(() => {
        setLeaving(true);
        timer = window.setTimeout(() => {
          setIndex((current) => (current + 1) % PHRASES.length);
          setLeaving(false);
          hold();
        }, 200);
      }, 1700);
    };
    hold();
    return () => window.clearTimeout(timer);
  }, [animate]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = true;
    const update = () => {
      const active = inView && !document.hidden && !motion.matches;
      setAnimate(active);
      if (!active) setLeaving(false);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    if (headingRef.current) observer.observe(headingRef.current);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <h1 className={`display ${styles.headline}`} id="hero-title" ref={headingRef}>
      <span className={styles.static}>Clear strategy.</span>
      <span className={styles.accessible}>Measurable growth.</span>
      <span className={styles.phrases} data-rotating-phrases data-animate={animate} aria-hidden="true">
        {PHRASES.map((phrase) => (
          <span className={styles.measure} key={phrase}>
            {phrase}
          </span>
        ))}
        <span className={`${styles.current}${leaving ? ` ${styles.leaving}` : ""}`} key={index} data-current-phrase data-phase={leaving ? "out" : "hold"}>
          {PHRASES[index]}
        </span>
      </span>
    </h1>
  );
}
