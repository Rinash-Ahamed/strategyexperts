import type { CSSProperties } from "react";
import styles from "./DigitalGrowthOrbit.module.css";

type Channel = "search" | "reviews" | "social" | "chat" | "person";

function ChannelIcon({ channel }: { channel: Channel }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {channel === "search" && <><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></>}
      {channel === "reviews" && <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />}
      {channel === "social" && <><path d="m4 9 13-5v16L4 15Z" /><path d="M4 9H2v6h2m3 1 1 5h3l-1-4m10-8 2-1m-2 8 2 1" /></>}
      {channel === "chat" && <path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5a9 9 0 1 1 16.5-4.5ZM8 12h.01M12 12h.01M16 12h.01" />}
      {channel === "person" && <><circle cx="12" cy="8" r="3" /><path d="M6 21v-2a6 6 0 0 1 12 0v2" /></>}
    </svg>
  );
}

const channels: { icon: Channel; title: string; detail: string; angle: number }[] = [
  { icon: "search", title: "Search", detail: "Be discovered", angle: -70 },
  { icon: "reviews", title: "Reviews", detail: "Build trust", angle: 20 },
  { icon: "chat", title: "WhatsApp", detail: "Opt-in reach", angle: 110 },
  { icon: "social", title: "Social", detail: "Local reach", angle: 200 },
];

/** Concept illustration, not a customer testimonial or live performance feed. */
export default function DigitalGrowthOrbit() {
  return (
    <figure className={styles.figure} data-digital-orbit>
      <input className={styles.pause} id="digital-growth-pause" type="checkbox" aria-label="Pause local-growth orbit animation" />
      <div className={styles.scene} role="img" aria-label="Your business connected to local customers through Google search, reviews, social campaigns and permission-based WhatsApp conversations.">
        <div className={styles.art} aria-hidden="true">
          <div className={`${styles.ring} ${styles.outer}`} />
          <div className={`${styles.ring} ${styles.middle}`} />
          <div className={`${styles.ring} ${styles.inner}`} />
          {channels.map(channel => (
            <div className={styles.runner} key={channel.icon} style={{ "--angle": `${channel.angle}deg` } as CSSProperties}>
              <div className={styles.member}>
                <div className={styles.upright}>
                  <div className={styles.message}>
                    <span className={styles.channelIcon}><ChannelIcon channel={channel.icon} /></span>
                    <span className={styles.messageCopy}><strong>{channel.title}</strong><span>{channel.detail}</span></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {[-125, 55].map(angle => (
            <div className={`${styles.runner} ${styles.customerRunner}`} key={angle} style={{ "--angle": `${angle}deg` } as CSSProperties}>
              <div className={styles.member}><div className={styles.upright}><span className={styles.customer}><ChannelIcon channel="person" /></span></div></div>
            </div>
          ))}
          <div className={styles.center}>
            <svg className={styles.pin} viewBox="0 0 40 48" fill="none"><path d="M20 45S4 29 4 19a16 16 0 1 1 32 0c0 10-16 26-16 26Z" stroke="currentColor" strokeWidth="1.2" /><circle cx="20" cy="19" r="5" fill="currentColor" /></svg>
            <strong>Your<br />business</strong>
            <span>Local growth</span>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span>Be found. Build trust. Stay connected.</span>
        <label className={styles.motionControl} htmlFor="digital-growth-pause">
          <span className={styles.pauseLabel}>Pause motion</span>
          <span className={styles.resumeLabel}>Resume motion</span>
        </label>
      </figcaption>
    </figure>
  );
}
