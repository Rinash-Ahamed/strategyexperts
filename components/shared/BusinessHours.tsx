import { SITE } from "@/lib/site";
import styles from "./BusinessHours.module.css";

export default function BusinessHours({ compact = false }: { compact?: boolean }) {
  const hours = SITE.businessHours;
  return (
    <div className={`${styles.hours}${compact ? ` ${styles.compact}` : ""}`} data-motion-region>
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
          </svg>
        </span>
        <p className={styles.title}>Business hours</p>
        <span className={styles.timezone}>{hours.timezone}</span>
      </div>
      <dl className={styles.schedule}>
        <div className={styles.working}>
          <dt>{hours.days}</dt>
          <dd><time dateTime={hours.opens}>{hours.opensDisplay}</time><span className={styles.to}> to </span><time dateTime={hours.closes}>{hours.closesDisplay}</time></dd>
        </div>
        <div className={styles.closed}>
          <dt>{hours.closedDay}<svg className={styles.dayArrow} viewBox="0 0 72 12" fill="none" aria-hidden="true" focusable="false"><path d="M1 6h68m-5-4 5 4-5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></dt>
          <dd><span className={styles.closedBadge}>Closed</span></dd>
        </div>
      </dl>
    </div>
  );
}
