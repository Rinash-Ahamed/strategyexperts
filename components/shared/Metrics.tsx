import { SITE, type Metric } from "@/lib/site";

/**
 * Renders reported figures only when NEXT_PUBLIC_SHOW_METRICS=true.
 * The figures were transcribed from screenshots and must be verified first.
 */
export default function Metrics({ items }: { items: Metric[] }) {
  if (!SITE.showMetrics) return null;
  return (
    <ul className="metrics" data-reveal>
      {items.map((m) => (
        <li className="metric" key={m.label}>
          <b>{m.value}</b>
          <span>{m.label}</span>
        </li>
      ))}
    </ul>
  );
}
