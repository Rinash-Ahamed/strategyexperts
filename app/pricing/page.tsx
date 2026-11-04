import type { Metadata } from "next";
import Link from "@/components/shared/PageLink";
import styles from "./pricing.module.css";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Explore Starter at $59/month, Pro at $99/month, or a tailored Custom plan for your business.",
  alternates: { canonical: "/pricing" },
};

const plans = [
  {
    name: "Starter", price: "$59", description: "Perfect for small businesses just getting started with their digital journey.",
    included: ["Online Reputation Management", "Customer Complaints Management", "Basic Performance Tracking", "Business Profile Optimization", "Email Support"],
    excluded: ["Advanced Analytics & Reporting", "Ads Campaign Management", "Custom Campaign Management", "Advanced Integrations", "Dedicated Account Manager"],
  },
  {
    name: "Pro", price: "$99", description: "Ideal for growing businesses looking to improve performance, increase visibility, and drive more sales.",
    included: ["Everything in Starter", "Advanced Analytics & Reporting", "Ads Campaign Management", "Business Performance Optimization", "Competitor Performance Analysis", "Deduction % Control Support", "Multi-Location Business Support", "Dedicated Account Manager", "Priority Support"],
    excluded: [],
  },
  {
    name: "Custom", price: "Tailored Pricing", description: "Flexible solutions designed for businesses with specific requirements, multiple locations, and large-scale operations.",
    included: ["Everything in Pro", "Custom Strategy & Consultation", "Full-Funnel Campaign Management", "Real-Time Dashboards & Reporting", "Dedicated Team & Account Manager", "Business Growth Plans", "Priority Support & Growth Planning"],
    excluded: [],
  },
];

export default function PricingPage() {
  return (
    <section className={styles.page} aria-labelledby="pricing-title">
      <div className={`wrap ${styles.inner}`}>
        <header className={styles.header}>
          <h1 id="pricing-title">The right plan.<br /><span>A stronger next chapter.</span></h1>
          <p>Choose the support that fits your business, from the first steps to your next stage of growth.</p>
        </header>
        <div className={styles.grid}>
          {plans.map((plan) => (
            <article className={`${styles.card}${plan.name === "Pro" ? ` ${styles.featured}` : ""}`} key={plan.name} aria-labelledby={`plan-${plan.name.toLowerCase()}`}>
              <div className={styles.cardTop}>
                <h2 id={`plan-${plan.name.toLowerCase()}`}>{plan.name}</h2>
                {plan.name === "Pro" && <span className={styles.badge}>Most Popular</span>}
              </div>
              <p className={styles.description}>{plan.description}</p>
              <p className={`${styles.price}${plan.name === "Custom" ? ` ${styles.tailored}` : ""}`}>
                <span>{plan.price}</span>{plan.name !== "Custom" && <span className={styles.period}>/month</span>}
              </p>
              <Link href={`/contact?plan=${plan.name.toLowerCase()}`} className={`btn ${styles.button}`} aria-label={`${plan.name === "Custom" ? "Contact sales about" : "Get started with"} the ${plan.name} plan`}>
                {plan.name === "Custom" ? "Contact Sales" : "Get Started"}<span className="arr" aria-hidden="true">→</span>
              </Link>
              <ul className={styles.features}>
                {[...plan.included.map(text => ({ text, included: true })), ...plan.excluded.map(text => ({ text, included: false }))].map(({ text, included }) => (
                  <li key={text} className={included ? undefined : styles.excluded}>
                    <span className={styles.featureIcon} aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="none" focusable="false"><path d={included ? "m3 8 3 3 7-7" : "m4 4 8 8m0-8-8 8"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span><span className={styles.accessible}>{included ? "Included: " : "Not included: "}</span>{text}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
