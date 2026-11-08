import Arrow from "@/components/shared/Arrow";
import Link from "@/components/shared/PageLink";
import HeroIntro from "@/components/home/HeroIntro";
import Ticker from "@/components/home/Ticker";
import ClientPartners from "@/components/home/ClientPartners";
import DashboardShowcase from "@/components/home/DashboardShowcase";
import StrategyJourney from "@/components/home/StrategyJourney";
import closing from "@/components/home/ClosingCta.module.css";

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------ Hero */}
      <section className="hero hero-text-only hero-frame" aria-labelledby="hero-title" data-motion-region>
        <div className="hero-atmosphere" aria-hidden="true">
          <span className="hero-atmosphere-lavender" />
        </div>
        <HeroIntro />
        <Ticker />
        <svg className="hero-frame-edge" viewBox="0 0 1440 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="hero-frame-silver" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#929292" stopOpacity=".08" />
              <stop offset=".5" stopColor="#d9d9d9" stopOpacity=".45" />
              <stop offset="1" stopColor="#929292" stopOpacity=".08" />
            </linearGradient>
          </defs>
          <path d="M0 23 Q720 -19 1440 23" fill="none" stroke="url(#hero-frame-silver)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </section>

      <DashboardShowcase />
      <StrategyJourney />
      <ClientPartners />

      {/* ------------------------------------------------ Final CTA */}
      <section className={closing.closing} aria-labelledby="cta-title" data-motion-region>
        <div className="wrap">
          <div className={closing.content}>
            <h2 className={closing.heading} id="cta-title">
              Let’s find your next <span className={closing.accent}>growth opportunity.</span>
            </h2>
            <p className={closing.description}>
              Tell us where your business is today and what you’re working towards. We’ll help you
              identify where the next opportunity lies.
            </p>
            <Link href="/contact" className={`btn ${closing.button}`}>
              <span className={closing.label}>Start a Conversation</span> <Arrow />
            </Link>
          </div>
        </div>
        <div className={closing.horizon} aria-hidden="true" />
      </section>
    </>
  );
}
