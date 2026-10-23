import Link from "@/components/shared/PageLink";
import Faq from "@/components/shared/Faq";
import Metrics from "@/components/shared/Metrics";
import DigitalGrowthOrbit from "./DigitalGrowthOrbit";
import IndustryVisual from "@/components/shared/IndustryVisual";
import PlatformMarks from "@/components/shared/PlatformMarks";
import { SERVICES, SITE, type Service } from "@/lib/site";

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

function HeroVisual({ s }: { s: Service }) {
  if (s.theme !== "digital") {
    return <div><IndustryVisual theme={s.theme} platforms={s.platforms} placement="service" /></div>;
  }
  return (
    <div className="rings-wrap">
      <DigitalGrowthOrbit />
      <PlatformMarks platforms={s.platforms} disclaimer />
    </div>
  );
}

export default function ServicePage({ service: s }: { service: Service }) {
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  const dark = s.theme === "hotel";

  return (
    <div className={`service-page surface-ivory t-${s.theme}`}>
      {/* ---------------- Hero ---------------- */}
      <section className={`sp-hero ${s.theme === "digital" ? "on-dark" : "service-hero-paper"} hero-${s.theme}`} aria-labelledby="sp-title">
        <div className="wrap">
          <div className="sp-hero-grid">
            <div className="stack-m">
              <nav className="crumb" aria-label="Breadcrumb">
                <ol>
                  <li><Link prefetch={false} href="/">Home</Link></li>
                  <li>
                    <span aria-hidden="true">/</span>
                    <span>Services</span>
                  </li>
                  <li>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">{s.navName}</span>
                  </li>
                </ol>
              </nav>
              <h1 className="h1" id="sp-title">
                {s.headline.map((l, i) => (
                  <Mask key={l} d={i * 0.08}>
                    {l}
                  </Mask>
                ))}
              </h1>
              <p className="lead">{s.intro}</p>
              <div className="sp-hero-actions">
                <Link prefetch={false} href={`/contact?service=${s.slug}`} className="btn btn-accent">
                  Get a Free Consultation <Arrow />
                </Link>
                <a href="#deliverables" className="btn btn-ghost">
                  Explore Our Services
                </a>
              </div>
            </div>
            <HeroVisual s={s} />
          </div>
        </div>
      </section>

      {/* ---------------- Problems ---------------- */}
      <section className="section" aria-labelledby="problems-title">
        <div className="wrap">
          <div className="block-head">
            <div className="stack-m" data-reveal>
              <h2 className="h2" id="problems-title">{s.problemsTitle}</h2>
            </div>
          </div>
          <ul className={`problems-list${s.theme === "ecom" || s.theme === "digital" ? " two" : ""}`} data-reveal>
            {s.problems.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Deliverables ---------------- */}
      <section id="deliverables" className="section" style={{ paddingTop: 0 }} aria-labelledby="deliver-title">
        <div className="wrap">
          <div className="block-head">
            <div className="stack-m" data-reveal>
              <h2 className="h2" id="deliver-title">{s.deliverablesTitle}</h2>
            </div>
            <p className="lead" data-reveal>{s.deliverablesIntro}</p>
          </div>
          <ul className="deliver" data-reveal>
            {s.deliverables.map((d) => (
              <li key={d.title}>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- WhatsApp consent (digital only) ---------------- */}
      {s.theme === "digital" && (
        <section className="section consent on-dark" aria-labelledby="wa-title">
          <div className="wrap consent-grid">
            <div className="stack-m" data-reveal>
              <h2 className="h2" id="wa-title">Direct reach, with permission.</h2>
              <p className="lead">
                WhatsApp Marketing Support helps businesses communicate directly with customers,
                promote relevant offers and improve engagement through planned, permission-based
                messaging.
              </p>
              <div className="practice">
                <h3>Best practice</h3>
                <p>
                  Message customers who have opted in, identify the business clearly, provide an easy
                  opt-out option and follow WhatsApp’s current business messaging policies.
                </p>
              </div>
            </div>
            <ul className="msgs" data-reveal>
              <li>Promotional campaigns and approved broadcast messages</li>
              <li>New product, service, offer and event announcements</li>
              <li>Appointment, booking and customer service updates</li>
              <li>Customer follow-ups and feedback requests</li>
              <li>Lead enquiries and customer engagement workflows</li>
              <li>Campaign planning and performance tracking</li>
            </ul>
          </div>
        </section>
      )}

      {/* ---------------- Focus ---------------- */}
      <section className="section focus-block" aria-labelledby="focus-title">
        <div className="wrap">
          <div className="block-head">
            <div className="stack-m" data-reveal>
              <h2 className="h2" id="focus-title">{s.focusTitle}</h2>
            </div>
          </div>
          <ul className={`focus-grid${s.focus.length === 5 ? " three" : ""}`} data-reveal>
            {s.focus.map((f) => (
              <li key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Approach ---------------- */}
      <section className="section" aria-labelledby="approach-title">
        <div className="wrap">
          <div className="block-head">
            <div className="stack-m" data-reveal>
              <h2 className="h2" id="approach-title">{s.approachTitle}</h2>
            </div>
          </div>
          {s.approachLayout === "columns" ? (
            <ol className="approach-cols">
              {s.approach.map((a, i) => (
                <li key={a.title} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </li>
              ))}
            </ol>
          ) : (
            <ol className="approach-stack" data-reveal>
              {s.approach.map((a) => (
                <li key={a.title}>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* ---------------- Audience ---------------- */}
      <section className="section-tight" aria-labelledby="aud-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stack-m" data-reveal>
            <h2 className="h2" id="aud-title" style={{ maxWidth: "20ch" }}>{s.audienceTitle}</h2>
          </div>
          <ul className="audience" style={{ marginTop: 32 }} data-reveal>
            {s.audience.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Verified metrics (hidden until approved) ---------------- */}
      {SITE.showMetrics && (
        <section className="section-tight" aria-labelledby="metrics-title">
          <div className="wrap">
            <div className="stack-m" data-reveal>
              <h2 className="h2" id="metrics-title">{s.metricsTitle}</h2>
              <p className="lead">{s.metricsIntro}</p>
            </div>
            <Metrics items={s.metrics} />
          </div>
        </section>
      )}

      {/* ---------------- FAQ ---------------- */}
      <section className="section" aria-labelledby="faq-title">
        <div className="wrap faq-grid">
          <div className="stack-m" data-reveal>
            <h2 className="h2" id="faq-title">Good to know.</h2>
          </div>
          <Faq items={s.faqs} />
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className={`section sp-cta on-dark${dark ? " dark" : ""}`} aria-labelledby="sp-cta-title">
        <div className="wrap">
          <h2 className="h1" id="sp-cta-title" style={{ marginTop: 20 }} data-reveal>
            {s.closing.headline}
          </h2>
          <p className="lead">{s.closing.body}</p>
          <div className="cta-row">
            <Link prefetch={false} href={`/contact?service=${s.slug}`} className="btn btn-light">
              Get a Free Consultation <Arrow />
            </Link>
            <Link prefetch={false} href="/contact" className="btn btn-outline-light">
              Talk to a Growth Expert
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Other services ---------------- */}
      <section className="section-tight" aria-labelledby="other-title" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <h2 className="h3" id="other-title" style={{ marginBottom: 20 }}>
            Other services
          </h2>
          <nav className="other-services" aria-label="Other services">
            {others.map((o) => (
              <Link prefetch={false} key={o.slug} href={`/services/${o.slug}`}>
                {o.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </div>
  );
}
