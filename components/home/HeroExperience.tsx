"use client";

import { useCallback, useEffect, useState } from "react";
import RobotHero from "./RobotHero";
import styles from "./HeroExperience.module.css";

export default function HeroExperience() {
  const [ready, setReady] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [deadlineReached, setDeadlineReached] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const exiting = deadlineReached || (ready && minimumElapsed);
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // The CSS reduced-motion rule hides the opening before hydration too.
    if (motion.matches) return;

    const minimum = window.setTimeout(() => setMinimumElapsed(true), 3000);
    const deadline = window.setTimeout(() => setDeadlineReached(true), 6000);
    // Never trap navigation or keyboard focus behind a decorative introduction.
    const dismiss = () => setDismissed(true);
    const onKey = (event: KeyboardEvent) => {
      if (["Escape", "Tab", "Enter", " "].includes(event.key)) dismiss();
    };
    const onMotionChange = () => { if (motion.matches) dismiss(); };
    window.addEventListener("pointerdown", dismiss, { once: true, passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    motion.addEventListener("change", onMotionChange);
    return () => {
      window.clearTimeout(minimum);
      window.clearTimeout(deadline);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", dismiss);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timeout = window.setTimeout(() => setDismissed(true), 450);
    return () => window.clearTimeout(timeout);
  }, [exiting]);

  return (
    <>
      <RobotHero onReady={handleReady} />
      {!dismissed && (
        <div className={`${styles.opening}${exiting ? ` ${styles.exiting}` : ""}`} data-hero-opening>
          <div className={styles.composition} aria-hidden="true">
            <div className={styles.words}>
              <span>Clarity.</span>
              <span>Strategy.</span>
              <span>Growth.</span>
            </div>
            <p>Strategy Experts</p>
          </div>
          <button className={styles.skip} type="button" onClick={() => setDismissed(true)}>Skip intro <span aria-hidden="true">↗</span></button>
        </div>
      )}
    </>
  );
}
