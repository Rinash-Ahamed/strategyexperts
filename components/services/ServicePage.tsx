import Arrow from "@/components/shared/Arrow";
import Link from "@/components/shared/PageLink";
import Faq from "@/components/shared/Faq";
import Metrics from "@/components/shared/Metrics";
import DigitalGrowthOrbit from "./DigitalGrowthOrbit";
import IndustryVisual from "@/components/shared/IndustryVisual";
import PlatformMarks from "@/components/shared/PlatformMarks";
import { SERVICES, SITE, type Service } from "@/lib/site";


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
                  <li><Link href="/">Home</Link></li>
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
                <Link href={`/contact?service=${s.slug}`} className="btn btn-accent">
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
          {s.theme === "digital" && <p className="note" style={{ marginTop: 20 }}>WhatsApp campaigns are permission-based, with clear business identification and an easy opt-out.</p>}
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
      <section className="section service-faq" aria-labelledby="faq-title">
        <div className="wrap faq-grid">
          <div className="stack-m faq-introduction" data-reveal>
            <h2 className="h2" id="faq-title">{s.faqTitle}</h2>
            <p>{s.faqIntro}</p>
            <Link href={`/contact?service=${s.slug}`} className="faq-consultation">
              {s.faqCta} <Arrow />
            </Link>
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
            <Link href={`/contact?service=${s.slug}`} className="btn btn-light">
              Get a Free Consultation <Arrow />
            </Link>
            <Link href="/contact" className="btn btn-outline-light">
              Talk to a Growth Expert
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Other services ---------------- */}
      {s.theme !== "digital" && (
      <section className="section-tight" aria-labelledby="other-title" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <h2 className="h3" id="other-title" style={{ marginBottom: 20 }}>
            Other services
          </h2>
          <nav className="other-services" aria-label="Other services">
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}`}>
                {o.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      )}
    </div>
  );
}
