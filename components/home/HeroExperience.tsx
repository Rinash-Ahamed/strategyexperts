"use client";

import { useCallback, useEffect, useState } from "react";
import RobotHero from "./RobotHero";
import styles from "./HeroExperience.module.css";

export default function HeroExperience() {
  const [ready, setReady] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const exiting = ready && minimumElapsed;
  const handleReady = useCallback(() => {
    if (document.documentElement.dataset.openingTrigger === "refresh") setReady(true);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // The CSS reduced-motion rule hides the opening before hydration too.
    if (motion.matches || document.documentElement.dataset.openingTrigger !== "refresh") return;

    document.documentElement.dataset.openingManaged = "true";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const minimum = window.setTimeout(() => setMinimumElapsed(true), 3000);
    // Never trap navigation or keyboard focus behind a decorative introduction.
    const dismiss = () => setDismissed(true);
    const onKey = (event: KeyboardEvent) => {
      if (["Escape", "Tab", "Enter", " "].includes(event.key)) dismiss();
    };
    const onMotionChange = () => { if (motion.matches) dismiss(); };
    window.addEventListener("keydown", onKey);
    motion.addEventListener("change", onMotionChange);
    return () => {
      window.clearTimeout(minimum);
      window.removeEventListener("keydown", onKey);
      motion.removeEventListener("change", onMotionChange);
      delete document.documentElement.dataset.openingManaged;
    };
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timeout = window.setTimeout(() => setDismissed(true), 450);
    return () => window.clearTimeout(timeout);
  }, [exiting]);

  useEffect(() => {
    if (!dismissed || document.documentElement.dataset.openingTrigger !== "refresh") return;
    // A refresh is a new opening, not history navigation to an old scroll spot.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.history.scrollRestoration = "auto";
    window.dispatchEvent(new Event("strategy-experts:opening-finished"));
  }, [dismissed]);

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
          <button className={styles.skip} type="button" data-opening-skip onClick={() => setDismissed(true)}>Skip intro <span aria-hidden="true">↗</span></button>
        </div>
      )}
    </>
  );
}
