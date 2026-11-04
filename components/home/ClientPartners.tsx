import Image from "next/image";
import anganan from "@/public/clients/anganan.jpeg";
import hmr from "@/public/clients/hmr.jpeg";
import mouzy from "@/public/clients/mouzy.jpeg";
import nahdi from "@/public/clients/Nahdi.jpeg";
import thalassery from "@/public/clients/thallassery.jpeg";
import thoopu from "@/public/clients/thoopu-kari-virunthu.png";
import tnt from "@/public/clients/tnt.jpeg";
import valarmathi from "@/public/clients/valarmathi.jpeg";
import zechai from "@/public/clients/zechai.jpeg";
import styles from "./ClientPartners.module.css";
import atmosphere from "./SectionAtmosphere.module.css";

const clients = [
  { name: "Covai Anganan Biriyani House", image: anganan },
  { name: "HMR Biriyani Restaurant", image: hmr },
  { name: "Mouzy Banana Avil Milk", image: mouzy },
  { name: "Nahdi Mandi Restaurant", image: nahdi },
  { name: "Thalassery Restaurant", image: thalassery },
  { name: "Thoopu Kari Virunthu", image: thoopu },
  { name: "T&T", image: tnt },
  { name: "Valarmathi Kongunaatu Samayal", image: valarmathi },
  { name: "Zé Cha!", image: zechai },
];

export default function ClientPartners() {
  return (
    <section className={`${styles.section} ${atmosphere.atmosphere}`} aria-labelledby="client-partners-title">
      <div className="wrap">
        <div className={styles.introduction}>
          <h2 className={styles.heading} id="client-partners-title">Trusted Restaurant Growth Partner <span className={styles.accent}>Across South India</span></h2>
          <p className={styles.summary}>Successfully Managing Online Restaurant Operations in <strong>3 States</strong></p>
          <ul className={styles.states} aria-label="States served">
            <li>Tamil Nadu</li><li>Karnataka</li><li>Kerala</li>
          </ul>
        </div>
        <ul className={styles.logos} aria-label="Our restaurant clients">
          {clients.map(client => (
            <li className={styles.logoFrame} key={client.name}>
              <Image src={client.image} alt={client.name} className={styles.logo} unoptimized />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
