import PlatformMarks from "./PlatformMarks";
import styles from "./IndustryVisual.module.css";

export default function GrowthPath({ platforms }: { platforms: readonly string[] }) {
  return (
    <div>
      <div className={styles.growth}>
        <p className={styles.growthTitle}>From discovery to demand.</p>
        <ol>
          <li><div><strong>Visibility</strong><p>Help the right people find your business.</p></div></li>
          <li><div><strong>Trust</strong><p>Build confidence through accurate information and reviews.</p></div></li>
          <li><div><strong>Enquiries</strong><p>Make it easier for interested customers to start a conversation.</p></div></li>
        </ol>
        <p>A working framework, not measured client performance.</p>
      </div>
      <PlatformMarks platforms={platforms} disclaimer />
    </div>
  );
}
