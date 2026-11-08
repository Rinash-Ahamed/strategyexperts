"use client";

import StaticImage from "@/components/shared/StaticImage";
import { useEffect, useRef, type CSSProperties } from "react";
import daily from "@/public/dashboard/1.webp";
import payout from "@/public/dashboard/2.webp";
import ticketing from "@/public/dashboard/3.webp";
import leaderboard from "@/public/dashboard/4.webp";
import visibility from "@/public/dashboard/5.webp";
import styles from "./RestaurantReports.module.css";

const reports = [
  { id: "daily", title: "Daily Insight", detail: "Your daily performance, in one view.", image: daily, alt: "Restaurant intelligence dashboard showing orders, sales and expenses." },
  { id: "payout", title: "Payout Report", detail: "Understand payouts and deductions.", image: payout, alt: "Restaurant payout report showing orders, deductions and net payouts." },
  { id: "ticketing", title: "Ticketing", detail: "Raise issues and track their resolution.", image: ticketing, alt: "Support centre showing issue categories and a support ticket form." },
  { id: "leaderboard", title: "Leaderboard", detail: "Compare performance across outlets.", image: leaderboard, alt: "Restaurant leaderboard comparing outlet sales, orders and campaign performance." },
  { id: "visibility", title: "Visibility Report", detail: "Track your online availability and presence.", image: visibility, alt: "Restaurant visibility report showing availability across locations." },
];

/** Keep native radio navigation; rotate without re-rendering the image tree. */
export default function RestaurantReports() {
  const containerRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const syncRotation = () => {
      clearInterval(timer);
      timer = undefined;
      if (!visible || document.hidden || reducedMotion.matches || container.matches(":hover, :focus-within")) return;
      timer = setInterval(() => {
        const current = inputs.findIndex(input => input.checked);
        inputs[(current + 1) % inputs.length].checked = true;
      }, 5000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncRotation();
    });
    observer.observe(container);
    const events = ["pointerenter", "pointerleave", "focusin", "focusout", "change"] as const;
    events.forEach(event => container.addEventListener(event, syncRotation));
    document.addEventListener("visibilitychange", syncRotation);
    reducedMotion.addEventListener("change", syncRotation);

    return () => {
      clearInterval(timer);
      observer.disconnect();
      events.forEach(event => container.removeEventListener(event, syncRotation));
      document.removeEventListener("visibilitychange", syncRotation);
      reducedMotion.removeEventListener("change", syncRotation);
    };
  }, []);

  return (
    <fieldset ref={containerRef} className={styles.reports} data-report-switcher>
      <legend className={styles.hidden}>Explore your restaurant performance reports</legend>
      {reports.map((report, index) => (
        <div className={styles.item} key={report.id} style={{ "--report-row": index + 1 } as CSSProperties}>
          <label className={styles.control}>
            <input className={styles.hidden} type="radio" name="restaurant-report" value={report.id} defaultChecked={index === 0} />
            <span className={styles.marker} aria-hidden="true" />
            <span><span className={styles.title}>{report.title}</span><span className={styles.detail}>{report.detail}</span></span>
          </label>
          <figure className={styles.preview}>
            <div className={styles.frame}>
              <StaticImage src={report.image} alt={report.alt} className={styles.image} sizes="(max-width: 899px) 94vw, (max-width: 1440px) 62vw, 880px" quality={90} loading="eager" fetchPriority="low" originalAtFullSize />
            </div>
          </figure>
        </div>
      ))}
    </fieldset>
  );
}
