import type { CSSProperties } from "react";
import { HOME_FRAMEWORK } from "@/lib/site";
import styles from "./StrategyJourney.module.css";

const icons = [
  "M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm6-2 6 6M7 10h6m-3-3v6",
  "m3 17 6-6 4 3 8-10m-6 0h6v6M3 22h18",
  "M6 3h12v18H6V3Zm3 5h6m-6 4h6m-6 4h3M9 1v4m6-4v4",
  "M20 9a8 8 0 0 0-14-3L3 9m0-5v5h5m-4 6a8 8 0 0 0 14 3l3-3m0 5v-5h-5m-8-3 3 3 5-6",
];

export default function StrategyJourney() {
  return (
    <section className={styles.section} aria-labelledby="strategy-journey-title" data-motion-region>
      <div className="wrap">
        <div className={styles.layout}>
        <div className={styles.introduction}>
          <h2 className={styles.heading} id="strategy-journey-title">
            Why <span className={styles.accent}>Choose Us</span>{" "}<span className={styles.question}>?</span>
          </h2>
          <p className={styles.promise}>From Understanding Your Business to Unlocking Its Potential.</p>
        </div>
        <ol className={styles.journey} role="list" aria-label="Our approach to sustainable growth">
          {HOME_FRAMEWORK.map((step, index) => (
            <li className={styles.stage} key={step.title} style={{ "--step": index } as CSSProperties}>
              <div className={styles.marker} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d={icons[index]} /></svg>
              </div>
              <div className={styles.copy}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        </div>
        <p className={styles.note}><em>Our approach is tailored to each business. Specific processes and deliverables may vary depending on the service engagement.</em></p>
      </div>
    </section>
  );
}
