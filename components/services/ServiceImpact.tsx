"use client";

import { useEffect, useRef } from "react";
import styles from "./ServiceDetails.module.css";

type Metric = { value: string; label: string };

export default function ServiceImpact({ items }: { items: Metric[] }) {
  const containerRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !("IntersectionObserver" in window)) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const counters = Array.from(container.querySelectorAll<HTMLElement>("[data-impact-value]"))
      .flatMap(node => {
        const value = node.dataset.impactValue ?? "";
        const match = /^(\d+)(.*)$/.exec(value);
        return match ? [{ node, value, target: Number(match[1]), suffix: match[2] }] : [];
      });
    let frame = 0;
    let startedAt: number | undefined;
    const finish = () => {
      cancelAnimationFrame(frame);
      counters.forEach(({ node, value }) => { node.textContent = value; });
    };
    const animate = (now: number) => {
      startedAt ??= now;
      const progress = Math.min((now - startedAt) / 1400, 1);
      const eased = 1 - (1 - progress) ** 3;
      counters.forEach(({ node, target, suffix }) => {
        const text = `${Math.round(target * eased)}${suffix}`;
        if (node.textContent !== text) node.textContent = text;
      });
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (!reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(animate);
    }, { threshold: 0.3 });
    observer.observe(container);
    const onMotionChange = () => {
      if (reducedMotion.matches) {
        observer.disconnect();
        finish();
      }
    };
    const onVisibilityChange = () => { if (document.hidden) finish(); };
    reducedMotion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [items]);

  return (
    <dl ref={containerRef} className={styles.impact}>
      {items.map(item => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            <span className="sr-only">{item.value}</span>
            <span className={styles.impactValue} aria-hidden="true">
              <span className={styles.impactReserve}>{item.value}</span>
              <span className={styles.impactNumber} data-impact-value={item.value}>{item.value}</span>
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
