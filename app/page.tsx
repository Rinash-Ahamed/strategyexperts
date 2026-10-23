import Link from "next/link";
import HeroExperience from "@/components/home/HeroExperience";
import HeroHeadline from "@/components/home/HeroHeadline";
import { ROBOT_SCENE_URL } from "@/lib/robot";
import Ticker from "@/components/home/Ticker";
import Metrics from "@/components/shared/Metrics";
import IndustryVisual from "@/components/shared/IndustryVisual";
import GrowthPath from "@/components/shared/GrowthPath";
import {
  CHALLENGE,
  HOME_FRAMEWORK,
  IMPACT_PRINCIPLES,
  SERVICES,
  SITE,
} from "@/lib/site";

const [ecom, restaurant, hotel, digital] = SERVICES;

const Arrow = () => (
  <span className="arr" aria-hidden="true">
    →
  </span>
);

const Mask = ({ children, d = 0 }: { children: React.ReactNode; d?: number }) => (
  <span className="line-mask">
    <span style={{ ["--d" as string]: `${d}s` }}>{children}</span>
  </span>
);

export default function Home() {
  return (
    <>
      <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
      <link rel="preload" href={ROBOT_SCENE_URL} as="fetch" crossOrigin="anonymous" fetchPriority="high" />
      {/* ------------------------------------------------ Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-glow hero-background-glow" aria-hidden="true" />
        <HeroExperience />

        <div className="wrap hero-shell">
          <div className="hero-side hero-side-left">
            <div className="hero-brand">
              <HeroHeadline />
              <p>Better strategy.<br />Stronger business.</p>
            </div>
            <nav className="hero-service-nav" aria-label="Commerce and hospitality services">
              {[ecom, restaurant].map((service) => (
                <Link prefetch={false} key={service.slug} href={`/services/${service.slug}`}>
                  <span>{service.navName}</span>
                  <span className="hero-service-arrow" aria-hidden="true">{"\u2197"}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="hero-side hero-side-right">
            <div className="hero-side-copy">
              <p>One clear operating view for ambitious businesses.</p>
            </div>
            <nav className="hero-service-nav" aria-label="Revenue and marketing services">
              {SERVICES.map((service, index) => (
                <Link
                  prefetch={false}
                  className={index < 2 ? "hero-service-mobile-only" : undefined}
                  key={service.slug}
                  href={`/services/${service.slug}`}
                >
                  <span>{service.navName}</span>
                  <span className="hero-service-arrow" aria-hidden="true">{"\u2197"}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="hero-footnote">
            <span>Independent growth consultancy</span>
            <span>India · Digital commerce</span>
          </div>
        </div>
      </section>

      <section className="hero-intro surface-ivory" aria-label="Introduction">
        <div className="wrap">
          <div className="hero-bottom">
            <div className="hero-copy stack-m">
              <p className="lead">
                Strategy Experts helps businesses improve performance across e-commerce, restaurants,
                hotels and digital marketing, combining platform expertise, market insight and
                hands-on execution.
              </p>
              <div className="hero-cta">
                <Link prefetch={false} href="/contact" className="btn btn-primary">
                  Discuss Your Business <Arrow />
                </Link>
                <a href="#expertise" className="btn btn-ghost">
                  Explore Our Expertise
                </a>
              </div>
            </div>
            <nav className="hero-index" aria-label="Services">
              {SERVICES.map((s) => (
                <Link prefetch={false} key={s.slug} href={`/services/${s.slug}`}>
                  {s.navName}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Credibility strip */}
      <section className="strip surface-ivory" aria-label="Capabilities">
        <div className="wrap">
          <ul className="strip-grid">
            <li className="strip-item">
              <span className="k">Marketplace expertise</span>
              <span className="v">Amazon · Flipkart · Meesho</span>
              <span className="s">Account management, listings and sales growth.</span>
            </li>
            <li className="strip-item">
              <span className="k">Restaurant growth</span>
              <span className="v">Zomato · Swiggy</span>
              <span className="s">Promotions, menus and online visibility.</span>
            </li>
            <li className="strip-item">
              <span className="k">Hotel revenue optimisation</span>
              <span className="v">MakeMyTrip · Booking.com · Agoda</span>
              <span className="s">Pricing, inventory and distribution across OTAs.</span>
            </li>
            <li className="strip-item">
              <span className="k">Digital customer acquisition</span>
              <span className="v">Google Business Profile · WhatsApp</span>
              <span className="s">Reputation, local visibility and lead generation.</span>
            </li>
          </ul>
        </div>
      </section>
      <Ticker />

      {/* ------------------------------------------------ Challenge */}
      <section className="section challenge surface-ivory" aria-labelledby="challenge-title">
        <div className="wrap challenge-grid">
          <div className="challenge-sticky stack-m" data-reveal>
            <h2 className="h2" id="challenge-title" style={{ maxWidth: "16ch" }}>
              {CHALLENGE.headline}
            </h2>
            <p className="lead">{CHALLENGE.body}</p>
          </div>
          <ul className="challenge-pillars" data-reveal>
            {CHALLENGE.pillars.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ Services */}
      <section id="expertise" className="expertise surface-ivory" aria-labelledby="expertise-title">
        <div className="wrap section-tight" style={{ paddingTop: 0 }}>
          <div className="block-head" style={{ marginBottom: 0 }}>
            <div className="stack-m" data-reveal>
              <h2 className="h2" id="expertise-title">
                Four disciplines. One commercial mindset.
              </h2>
            </div>
            <p className="lead" data-reveal>
              More than platform management. We build growth strategies that pair market insight with
              hands-on execution.
            </p>
          </div>
        </div>

        {/* 01 - E-Commerce */}
        <article className="sc sc-1 surface-ivory" aria-labelledby="sc1">
          <div className="wrap pad">
            <div className="grid">
              <div data-reveal><IndustryVisual theme="ecom" platforms={ecom.platforms} /></div>
              <div className="stack-m" data-reveal>
                <h3 className="sc-title" id="sc1">{ecom.name}</h3>
                <p className="sc-summary">{ecom.summary}</p>
                <ul className="sc-caps">
                  {ecom.capabilities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <Link prefetch={false} className="link-arrow" href={`/services/${ecom.slug}`}>
                  Explore Service <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* 02 - Restaurant */}
        <article className="sc sc-2 surface-silver" aria-labelledby="sc2">
          <div className="wrap pad">
            <div className="grid">
              <div data-reveal><IndustryVisual theme="restaurant" platforms={restaurant.platforms} /></div>
              <div className="stack-m" data-reveal>
                <h3 className="sc-title" id="sc2" style={{ color: "var(--accent-ink)" }}>
                  {restaurant.name}
                </h3>
                <p className="sc-summary" style={{ color: "var(--ink-2)", opacity: 1 }}>
                  {restaurant.summary}
                </p>
                <ul className="sc-caps">
                  {restaurant.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
                <Link prefetch={false} className="link-arrow" href={`/services/${restaurant.slug}`}>
                  Explore Service <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* 03 - Hotel */}
        <article className="sc sc-3 surface-ivory" aria-labelledby="sc3">
          <div className="wrap pad">
            <div className="grid">
              <div className="stack-l" data-reveal>
                <h3 className="sc-title" id="sc3">{hotel.name}</h3>
                <p className="sc-summary">{hotel.summary}</p>
                <ul className="sc-caps">
                  {hotel.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
                <Link prefetch={false} className="link-arrow" href={`/services/${hotel.slug}`}>
                  Explore Service <Arrow />
                </Link>
              </div>
              <div data-reveal><IndustryVisual theme="hotel" platforms={hotel.platforms} /></div>
            </div>
          </div>
        </article>

        {/* 04 - Digital */}
        <article className="sc sc-4 surface-ivory" aria-labelledby="sc4">
          <div className="wrap pad">
            <div className="grid">
              <div data-reveal>
                <GrowthPath platforms={digital.platforms} />
              </div>
              <div className="stack-m" data-reveal>
                <h3 className="sc-title" id="sc4">{digital.name}</h3>
                <p className="sc-summary" style={{ opacity: 1, color: "var(--ink-2)" }}>
                  {digital.summary}
                </p>
                <ul className="sc-caps">
                  {digital.capabilities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className="consent-note">
                  <b>WhatsApp, done with permission.</b> Messaging is aimed at customers who have opted
                  in, with the business clearly identified and an easy way to opt out.
                </p>
                <Link prefetch={false} className="link-arrow" href={`/services/${digital.slug}`}>
                  Explore Service <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* ------------------------------------------------ How we work */}
      <section className="section process surface-silver" aria-labelledby="process-title">
        <div className="wrap">
          <div className="block-head">
            <div className="stack-m" data-reveal>
              <h2 className="h2" id="process-title">From where you are to what’s next.</h2>
            </div>
            <p className="lead" data-reveal>
              A practical way to approach business improvement. Every engagement is shaped around your
              platforms, market and goals.
            </p>
          </div>
          <ol className="process-list">
            {HOME_FRAMEWORK.map((s) => (
              <li className="process-step" key={s.title} data-reveal>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="note" style={{ marginTop: 20 }}>
            A suggested working framework. Each service page outlines its own approach.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ Impact */}
      <section className="section impact surface-ivory" aria-labelledby="impact-title">
        <div className="wrap">
          <div className="impact-grid">
            <div className="stack-m" data-reveal>
              <h2 className="h2" id="impact-title" style={{ maxWidth: "14ch" }}>
                Better decisions, made consistently.
              </h2>
              <p className="lead">
                We combine platform expertise, market insights and hands-on execution to help you make
                better decisions, improve performance and increase revenue, not just manage your
                accounts.
              </p>
            </div>
            <ul className="principles" data-reveal>
              {IMPACT_PRINCIPLES.map((p) => (
                <li key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Figures appear only after verification (NEXT_PUBLIC_SHOW_METRICS=true).
              Each set belongs to its own service, so they are never presented as company-wide. */}
          {SITE.showMetrics && (
            <div style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
              {SERVICES.map((s) => (
                <div key={s.slug} style={{ marginTop: 8 }}>
                  <h3 className="h3" style={{ marginTop: 32 }}>
                    {s.name}
                  </h3>
                  <Metrics items={s.metrics} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------ Final CTA */}
      <section className="section cta on-dark" aria-labelledby="cta-title">
        <div className="wrap">
          <h2 className="h1" id="cta-title" style={{ marginTop: 20 }} data-reveal>
            Let’s find your next growth opportunity.
          </h2>
          <p className="lead" style={{ marginTop: 28 }}>
            Tell us where your business is today and what you’re working towards. We’ll help you
            identify where the next opportunity lies.
          </p>
          <div className="cta-row">
            <Link prefetch={false} href="/contact" className="btn btn-light">
              Start a Conversation <Arrow />
            </Link>
            <Link prefetch={false} href={`/services/${ecom.slug}`} className="btn btn-outline-light">
              See what we do
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
