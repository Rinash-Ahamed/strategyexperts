import type { ReactNode } from "react";
import styles from "./legal.module.css";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <section className={styles.page}><article className={styles.document}>{children}</article></section>;
}
