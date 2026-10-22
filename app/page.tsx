import Link from "next/link";
import Ticker from "@/components/home/Ticker";
import Metrics from "@/components/shared/Metrics";
import { Rings } from "@/components/shared/Visuals";
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
      {/* ------------------------------------------------ Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-curve" aria-hidden="true">
          <svg viewBox="0 0 1600 560" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curve-fade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#bababa" stopOpacity=".78" />
                <stop offset=".38" stopColor="#9a9a9a" stopOpacity=".5" />
                <stop offset=".72" stopColor="#515151" stopOpacity=".16" />
                <stop offset="1" stopColor="#111111" stopOpacity="0" />
              </linearGradient>
              <filter id="curve-blur" x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>
            <path className="curve-halo" d="M-100 72C390 142 980 330 1510 650" />
            <path className="curve-line" d="M-100 72C390 142 980 330 1510 650" />
          </svg>
        </div>

        <div className="wrap hero-shell">
          <div className="hero-brand">
            <h1 className="display" id="hero-title">
              Strategy Experts<span aria-hidden="true">.</span>
            </h1>
            <p>Better strategy. Stronger business.</p>
          </div>
          <div className="hero-footnote" aria-hidden="true">
            <span>Independent growth consultancy</span>
            <span>India · Digital commerce</span>
          </div>
        </div>
      </section>

      <section className="hero-intro" aria-label="Introduction">
        <div className="wrap">
          <div className="hero-bottom">
            <div className="hero-copy stack-m">
              <p className="lead">
                Strategy Experts helps businesses improve performance across e-commerce, restaurants,
                hotels and digital marketing, combining platform expertise, market insight and
                hands-on execution.
              </p>
              <div className="hero-cta">
                <Link href="/contact" className="btn btn-primary">
                  Discuss Your Business <Arrow />
                </Link>
                <a href="#expertise" className="btn btn-ghost">
                  Explore Our Expertise
                </a>
              </div>
            </div>
            <nav className="hero-index" aria-label="Services">
              {SERVICES.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`}>
                  <span>{s.index}</span>
                  {s.navName}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Credibility strip */}
      <section className="strip" aria-label="Capabilities">
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
      <section className="section" aria-labelledby="challenge-title">
        <div className="wrap challenge-grid">
          <div className="challenge-sticky stack-m" data-reveal>
            <span className="eyebrow">The challenge</span>
            <h2 className="h2" id="challenge-title" style={{ maxWidth: "16ch" }}>
              {CHALLENGE.headline}
            </h2>
            <p className="lead">{CHALLENGE.body}</p>
          </div>
          <ul className="challenge-pillars" data-reveal>
            {CHALLENGE.pillars.map((p, i) => (
              <li key={p.title}>
                <span className="n">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ Services */}
      <section id="expertise" aria-labelledby="expertise-title">
        <div className="wrap section-tight" style={{ paddingTop: 0 }}>
          <div className="block-head" style={{ marginBottom: 0 }}>
            <div className="stack-m" data-reveal>
              <span className="eyebrow">Our expertise</span>
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

        {/* 01 — E-Commerce */}
        <article className="sc sc-1" aria-labelledby="sc1">
          <div className="wrap pad">
            <div className="sc-head">
              <span className="sc-num" style={{ color: "var(--blue)" }}>01 / 04</span>
              <span className="sc-num muted">Marketplaces</span>
            </div>
            <div className="grid">
              <div className="mk" aria-hidden="true">
                {ecom.platforms.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
              <div className="stack-m" data-reveal>
                <h3 className="sc-title" id="sc1">{ecom.name}</h3>
                <p className="sc-summary">{ecom.summary}</p>
                <ul className="sc-caps">
                  {ecom.capabilities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <Link className="link-arrow" href={`/services/${ecom.slug}`}>
                  Explore Service <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* 02 — Restaurant */}
        <article className="sc sc-2" aria-labelledby="sc2">
          <div className="wrap pad">
            <div className="sc-head">
              <span className="sc-num" style={{ color: "var(--accent)" }}>02 / 04</span>
              <span className="sc-num muted">Restaurants & cloud kitchens</span>
            </div>
            <div className="grid">
              <div className="menu-card" data-reveal>
                <p className="mini">The menu</p>
                {restaurant.capabilities.map((c, i) => (
                  <div className="menu-line" key={c}>
                    {c}
                    <em>0{i + 1}</em>
                  </div>
                ))}
              </div>
              <div className="stack-m" data-reveal>
                <h3 className="sc-title" id="sc2" style={{ color: "var(--accent-ink)" }}>
                  {restaurant.name}
                </h3>
                <p className="sc-summary" style={{ color: "var(--ink-2)", opacity: 1 }}>
                  {restaurant.summary}
                </p>
                <div className="plats" aria-hidden="true">
                  <span>Zomato</span>
                  <span>Swiggy</span>
                </div>
                <Link className="link-arrow" href={`/services/${restaurant.slug}`}>
                  Explore Service <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* 03 — Hotel */}
        <article className="sc sc-3 on-dark" aria-labelledby="sc3">
          <div className="wrap pad">
            <div className="sc-head">
              <span className="sc-num">03 / 04</span>
              <span className="sc-num muted">Specialist hospitality service</span>
            </div>
            <div className="grid">
              <div className="stack-l" data-reveal>
                <h3 className="sc-title" id="sc3">{hotel.name}</h3>
                <p className="sc-summary">{hotel.summary}</p>
                <div className="bigterms">
                  <span>Occupancy</span>
                  <span>ADR</span>
                  <span>RevPAR</span>
                </div>
                <Link className="link-arrow" href={`/services/${hotel.slug}`}>
                  Explore Service <Arrow />
                </Link>
              </div>
              <ol className="ledger" data-reveal>
                {hotel.capabilities.map((c, i) => (
                  <li className="ledger-row" key={c}>
                    <b>0{i + 1}</b>
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </article>

        {/* 04 — Digital */}
        <article className="sc sc-4" aria-labelledby="sc4">
          <div className="wrap pad">
            <div className="sc-head">
              <span className="sc-num" style={{ color: "var(--accent)" }}>04 / 04</span>
              <span className="sc-num muted">Google · Meta · WhatsApp</span>
            </div>
            <div className="grid">
              <div data-reveal>
                <Rings />
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
                <Link className="link-arrow" href={`/services/${digital.slug}`}>
                  Explore Service <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* ------------------------------------------------ How we work */}
      <section className="section process" aria-labelledby="process-title">
        <div className="wrap">
          <div className="block-head">
            <div className="stack-m" data-reveal>
              <span className="eyebrow">How we work</span>
              <h2 className="h2" id="process-title">From where you are to what’s next.</h2>
            </div>
            <p className="lead" data-reveal>
              A practical way to approach business improvement. Every engagement is shaped around your
              platforms, market and goals.
            </p>
          </div>
          <ol className="process-list">
            {HOME_FRAMEWORK.map((s, i) => (
              <li className="process-step" key={s.title} data-reveal>
                <span className="num" aria-hidden="true">0{i + 1}</span>
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
      <section className="section impact" aria-labelledby="impact-title">
        <div className="wrap">
          <div className="impact-grid">
            <div className="stack-m" data-reveal>
              <span className="eyebrow">Business impact</span>
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
                  <p className="eyebrow" style={{ ["--accent" as string]: "var(--blue)", marginTop: 32 }}>
                    {s.name}
                  </p>
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
          <span className="eyebrow">Ready when you are</span>
          <h2 className="h1" id="cta-title" style={{ marginTop: 20 }} data-reveal>
            Let’s find your next growth opportunity.
          </h2>
          <p className="lead" style={{ marginTop: 28 }}>
            Tell us where your business is today and what you’re working towards. We’ll help you
            identify where the next opportunity lies.
          </p>
          <div className="cta-row">
            <Link href="/contact" className="btn btn-light">
              Start a Conversation <Arrow />
            </Link>
            <Link href={`/services/${ecom.slug}`} className="btn btn-outline-light">
              See what we do
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
