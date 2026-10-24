import type { CSSProperties } from "react";
import { HOME_FRAMEWORK } from "@/lib/site";
import styles from "./StrategyJourney.module.css";

const paths = [
  "M12 4v4m0 8v4M4 12h4m8 0h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  "m5 16 5-5 4 3 5-8m-5 0h5v5",
  "M6 5h12v14H6zM9 9h6m-6 3h6m-6 3h3",
  "M19 9a7 7 0 0 0-12-3L4 9m0-5v5h5m-4 6a7 7 0 0 0 12 3l3-3m0 5v-5h-5",
];

export default function StrategyJourney() {
  return (
    <ol className={styles.journey} role="list" aria-label="Our working framework">
      {HOME_FRAMEWORK.map((step, index) => (
        <li className={styles.stage} key={step.title}>
          <div className={styles.content} data-reveal style={{ "--d": `${index * 0.07}s` } as CSSProperties}>
            <span className={styles.marker} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <path d={paths[index]} />
              </svg>
            </span>
            <div className={styles.copy}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
