import type { Faq as FaqType } from "@/lib/site";

export default function Faq({ items }: { items: FaqType[] }) {
  return (
    <div className="faq" data-reveal>
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p className="ans">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
