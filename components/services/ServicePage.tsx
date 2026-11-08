import type { Service } from "@/lib/site";
import { SERVICE_DETAILS } from "@/lib/service-details";
import ServiceDetails from "./ServiceDetails";
import styles from "./ServicePage.module.css";

export default function ServicePage({ service }: { service: Service }) {
  const content = SERVICE_DETAILS[service.slug];
  return (
    <section className={`${styles.page}${content ? ` ${styles.detailed}` : ""}`} aria-label={service.name} data-motion-region>
      {content && <ServiceDetails service={service} content={content} />}
    </section>
  );
}
