import styles from "./GrowthPriorities.module.css";

const symbols = [
  <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" /></>,
  <><path d="M3 18h18M5 14l4-5 4 3 6-8" /><path d="M15 4h4v4" /></>,
  <><path d="M4 20V14m5 6V10m5 10V6m5 14V2" /><path d="M2 22h20" /></>,
];

/** An illustrative growth sequence, not reported business metrics. */
export default function GrowthPriorities({ items }: { items: readonly { title: string; body: string }[] }) {
  return (
    <ul className={styles.sequence} role="list" data-reveal>
      {items.map((item, index) => (
        <li className={styles.step} key={item.title}>
          <span className={styles.symbol} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" focusable="false">
              {symbols[index]}
            </svg>
          </span>
          <div className={styles.copy}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
