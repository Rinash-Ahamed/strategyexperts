import Image from "next/image";
import overview from "@/public/dashboard/1.webp";
import payout from "@/public/dashboard/2.webp";
import support from "@/public/dashboard/3.webp";
import leaderboard from "@/public/dashboard/4.webp";
import visibility from "@/public/dashboard/5.webp";
import styles from "./DashboardShowcase.module.css";
import atmosphere from "./SectionAtmosphere.module.css";

const slides = [
  { title: "Restaurant Intelligence Hub", description: "One Platform. Complete Visibility. Smarter Decisions.", image: overview, alt: "Strategy Experts performance dashboard showing order trends, sales and expenses." },
  { title: "Smart Payout & Reconciliation Management", description: "Know Every Rupee. Control Every Deduction.", image: payout, alt: "Strategy Experts payout report showing orders, deductions and net payouts." },
  { title: "Smart Support & Ticketing", description: "Raise. Track. Resolve.", image: support, alt: "Strategy Experts support centre with issue categories and a support ticket form." },
  { title: "Restaurant Performance Leaderboard", description: "Compare branch-level orders, sales, average order value, conversions, rejections and campaign revenue. Benchmark outlets, spot growth opportunities and improve performance.", image: leaderboard, alt: "Strategy Experts restaurant leaderboard comparing orders, sales and campaign performance." },
  { title: "Restaurant Visibility & Growth Insights", description: "Monitor performance, track online visibility and identify growth opportunities.", image: visibility, alt: "Strategy Experts visibility report showing restaurant availability across locations." },
];

export default function DashboardShowcase() {
  return (
    <section className={styles.section} aria-labelledby="dashboard-showcase-title" data-motion-region>
      <div className={`${styles.surface} ${atmosphere.atmosphere}`} aria-hidden="true" />
      <div className="wrap">
        <h2 id="dashboard-showcase-title" className={styles.heading}>Everything You Need to <span className={styles.accent}>Track, Analyse &amp; Grow.</span></h2>
        <p className={styles.introduction}>From daily operations to your next decision. A clearer view, every step of the way.</p>
        <div className={styles.sequence}>
          {slides.map(slide => (
            <figure className={styles.slide} key={slide.title} data-motion-region>
              <figcaption className={styles.copy}>
                <span className={styles.signal} aria-hidden="true" />
                <h3><span className={styles.titleText}>{slide.title}<span className={styles.titleLight} aria-hidden="true">{slide.title}</span></span></h3>
                <p>{slide.description}</p>
              </figcaption>
              <div className={styles.frame}>
                <Image src={slide.image} alt={slide.alt} className={styles.image} loading="eager" fetchPriority="low" unoptimized />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
