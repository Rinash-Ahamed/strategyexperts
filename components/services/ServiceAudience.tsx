import type { ServiceDetails } from "@/lib/service-details";
import type { ServiceTheme } from "@/lib/site";
import shared from "./ServiceDetails.module.css";
import styles from "./ServiceAudience.module.css";

const COMMERCE_ICONS = [
  "m12 3 9 5-9 5-9-5 9-5Zm-9 5v10l9 5 9-5V8M12 13v10M7.5 5.5l9 5",
  "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z",
  "M4 10v11h16V10M3 4h18l1 6a3 3 0 0 1-5 2 3 3 0 0 1-5 0 3 3 0 0 1-5 0 3 3 0 0 1-5-2l1-6Zm6 17v-6h6v6",
  "m14 3 7 7-8 8-7-7 8-8ZM6 11l-3 1-1 5 5-1m6 2-1 3-5 1 1-5M15 7h.01M3 21l2-2",
];
const HOTEL_ICONS = [
  "M4 21V5l8-3 8 3v16M2 21h20M8 8h1m6 0h1M8 12h1m6 0h1M10 21v-5h4v5",
  "M3 21h18M5 17V9h14v8M3 9l9-6 9 6M9 17v-4h6v4M2 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2",
  "M5 21V6l7-3 7 3v15M3 21h18M9 8h6m-6 4h6m-5 9v-5h4v5",
  "M3 10h18L12 3l-9 7Zm2 3v8m7-8v8m7-8v8M2 21h20",
];
const DIGITAL_ICONS = [
  "M4 3v6a3 3 0 0 0 6 0V3M7 3v18m10-18v18m0-18c4 3 4 8 0 9",
  COMMERCE_ICONS[2],
  "M4 8h16v13H4V8Zm4 0V4h8v4M4 13h16m-10-2v4h4v-4",
  "M8 3h8v5h5v8h-5v5H8v-5H3V8h5V3Z",
  "M12 21c-6-1-9-5-9-10 5 0 8 2 9 6 1-4 4-6 9-6 0 5-3 9-9 10Zm0-4C7 12 8 7 12 3c4 4 5 9 0 14Z",
  "M12 22s8-8 8-13a8 8 0 1 0-16 0c0 5 8 13 8 13Zm0-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
];
const RESTAURANT_ICONS = [
  DIGITAL_ICONS[0],
  "M4 5h12v9a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V5Zm12 1h3a3 3 0 0 1 0 6h-3M3 22h15",
  "M3 11 12 3l9 8M5 10v11h14V10M9 21v-7h6v7M2 12h20",
  "M12 3v5m0 0H5v5m7-5h7v5M5 17v4m14-4v4M2 13h6v4H2v-4Zm14 0h6v4h-6v-4Z",
];

export default function ServiceAudience({ title, items, theme }: { title: string; items: ServiceDetails["audience"]; theme: ServiceTheme }) {
  const icons = theme === "restaurant" ? RESTAURANT_ICONS : theme === "digital" ? DIGITAL_ICONS : theme === "hotel" ? HOTEL_ICONS : COMMERCE_ICONS;
  return (
    <section className={shared.section} aria-labelledby="audience-heading">
      <header className={shared.sectionHeader}>
        <p className={shared.category}>Who We Work With</p>
        <h2 id="audience-heading">{theme === "ecom" ? <>For Every <span className={styles.accent}><span className={shared.keepTogether}>E-Commerce</span> Business</span></> : title}</h2>
      </header>
      <ul className={styles.grid}>
        {items.map((item, index) => (
          <li className={styles.item} key={item.title}>
            <span className={styles.icon} aria-hidden="true"><svg viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d={icons[index]} /></svg></span>
            <div><h3>{item.title}</h3><p>{item.body}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
