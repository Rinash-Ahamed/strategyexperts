import StaticImage from "@/components/shared/StaticImage";
import { getClientLogos } from "@/lib/logo-library";
import styles from "./ClientPartners.module.css";
import atmosphere from "./SectionAtmosphere.module.css";

export default async function ClientPartners() {
  const clients = await getClientLogos();
  return (
    <section className={`${styles.section} ${atmosphere.atmosphere}`} aria-labelledby="client-partners-title" data-motion-region>
      <div className="wrap">
        <div className={styles.introduction}>
          <h2 className={styles.heading} id="client-partners-title">Trusted Restaurant Growth Partner <span className={styles.accent}>Across South India</span></h2>
          <p className={styles.summary}>Successfully Managing Online Restaurant Operations in <strong>3 States</strong></p>
          <ul className={styles.states} aria-label="States served">
            <li>Tamil Nadu</li><li>Karnataka</li><li>Kerala</li>
          </ul>
        </div>
        <div className={styles.gallery}>
        <div className={styles.orbit} aria-hidden="true" />
        <ul className={styles.logos} aria-label="Our restaurant clients">
          {clients.map(client => (
            <li className={styles.logoFrame} key={client.src}>
              <span className={styles.plaque}><span className={styles.logoBox}><StaticImage src={client.src} variants={client.variants} alt={client.name} className={styles.logo} fill slotWidth={156} loading="lazy" sizes="(max-width: 600px) 130px, 156px" /></span></span>
            </li>
          ))}
        </ul>
        <div className={styles.more}>
          <span className={styles.moreMark} aria-hidden="true"><span /><span /><span /></span>
          <p>And many more<span>Different businesses. Shared ambition.</span></p>
        </div>
        </div>
      </div>
    </section>
  );
}
