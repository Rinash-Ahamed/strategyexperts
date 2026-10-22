"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function RobotHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    const viewport = window.matchMedia("(min-width: 760px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(viewport.matches && !motion.matches);

    update();
    viewport.addEventListener("change", update);
    motion.addEventListener("change", update);

    return () => {
      viewport.removeEventListener("change", update);
      motion.removeEventListener("change", update);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!enabled || loaded) return;
    const timeout = window.setTimeout(() => setLoaderVisible(false), 6000);
    return () => window.clearTimeout(timeout);
  }, [enabled, loaded]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const { clientX, clientY } = event;

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const bounds = container.getBoundingClientRect();
      container.style.setProperty("--robot-x", `${clientX - bounds.left}px`);
      container.style.setProperty("--robot-y", `${clientY - bounds.top}px`);
    });
  };

  if (!enabled) return null;

  return (
    <div
      className={`hero-robot${loaded ? " is-loaded" : ""}`}
      ref={containerRef}
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <div className="hero-robot-light" />
      {loaderVisible && !loaded && (
        <div className="hero-robot-loader">
          <span />
          <small>Loading interactive model</small>
        </div>
      )}
      <Spline
        className="hero-robot-canvas"
        scene={SCENE_URL}
        onLoad={() => {
          setLoaded(true);
          setLoaderVisible(false);
        }}
      />
    </div>
  );
}
