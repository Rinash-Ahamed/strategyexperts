import Image from "next/image";
import payout from "@/public/dashboard/1.jpeg";
import support from "@/public/dashboard/2.jpeg";
import overview from "@/public/dashboard/3.jpeg";
import leaderboard from "@/public/dashboard/4.jpeg";
import visibility from "@/public/dashboard/5.jpeg";
import styles from "./DashboardShowcase.module.css";
import atmosphere from "./SectionAtmosphere.module.css";

const slides = [
  { title: "Know where every rupee goes.", description: "See orders, deductions and net payouts together. Understand what reaches your business, not just what you sell.", image: payout, alt: "Strategy Experts payout report showing restaurant orders, deductions and net payouts." },
  { title: "Less chasing. More clarity.", description: "Raise an issue with the right context, from payment concerns to platform support. Keep the next step clear.", image: support, alt: "Strategy Experts support centre with issue categories and a support ticket form." },
  { title: "See the bigger picture.", description: "Connect order trends, peak hours, sales and expenses. Turn a busy dashboard into a clearer view of your business.", image: overview, alt: "Strategy Experts dashboard showing order trends, peak orders, sales and expenses." },
  { title: "Find what moves you forward.", description: "Compare orders, sales and campaign performance across restaurants. See where attention can make a difference.", image: leaderboard, alt: "Strategy Experts restaurant leaderboard comparing orders, sales and campaign performance." },
  { title: "Be there when customers look.", description: "Review availability across locations. Spot gaps in your online presence before they become missed opportunities.", image: visibility, alt: "Strategy Experts visibility report showing restaurant availability across locations." },
];

export default function DashboardShowcase() {
  return (
    <section className={`${styles.section} ${atmosphere.atmosphere}`} aria-labelledby="dashboard-showcase-title">
      <div className="wrap">
        <h2 id="dashboard-showcase-title" className={styles.heading}>Everything You Need to <span className={styles.accent}>Track, Analyse &amp; Grow.</span></h2>
        <p className={styles.introduction}>From daily operations to your next decision. A clearer view, every step of the way.</p>
        <div className={styles.sequence}>
          {slides.map(slide => (
            <figure className={styles.slide} key={slide.title}>
              <figcaption className={styles.copy}>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </figcaption>
              <div className={styles.frame}>
                <Image src={slide.image} alt={slide.alt} className={styles.image} unoptimized />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
