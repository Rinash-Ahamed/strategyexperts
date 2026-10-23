"use client";

import dynamic from "next/dynamic";
import type { Application, SPEObject } from "@splinetool/runtime";
import { useCallback, useEffect, useRef, useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

type HandRig = {
  object: SPEObject;
  origin: { x: number; y: number; z: number };
  mirror: number;
};

export default function RobotHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SPEObject | null>(null);
  const headOriginRef = useRef({ x: 0, y: 0 });
  const handsRef = useRef<HandRig[]>([]);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const trackingRef = useRef(false);
  const applicationRef = useRef<Application | null>(null);
  const visibleRef = useRef(true);
  const [loaded, setLoaded] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreferences = () => {
      trackingRef.current = precisePointer.matches && !motion.matches;
      if (containerRef.current) {
        containerRef.current.dataset.headTracking = trackingRef.current ? "enabled" : "disabled";
      }

      if (!trackingRef.current) {
        targetRef.current = { x: 0, y: 0 };
        currentRef.current = { x: 0, y: 0 };
        for (const hand of handsRef.current) {
          Object.assign(hand.object.rotation, hand.origin);
        }
        if (headRef.current) Object.assign(headRef.current.rotation, headOriginRef.current);
        applicationRef.current?.requestRender();
      }
      applicationRef.current?.setGlobalEvents(trackingRef.current);
    };

    const updatePointer = (event: PointerEvent) => {
      if (!trackingRef.current || !visibleRef.current || event.pointerType === "touch") return;

      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      if (event.clientY < bounds.top || event.clientY > bounds.bottom || event.clientX < bounds.left || event.clientX > bounds.right) {
        resetPointer();
        return;
      }
      const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
      const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
      targetRef.current = { x, y };

      const container = containerRef.current;
      if (container) {
        container.dataset.pointerTarget = `${x.toFixed(2)},${y.toFixed(2)}`;
      }
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(animateRig);
      }
    };

    const resetPointer = () => {
      targetRef.current = { x: 0, y: 0 };
      if (trackingRef.current && visibleRef.current && frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(animateRig);
      }
    };

    let previousTime = 0;
    const animateRig = (time: number) => {
      frameRef.current = null;
      const head = headRef.current;

      if ((head || handsRef.current.length) && trackingRef.current && visibleRef.current) {
        const current = currentRef.current;
        const targetYaw = targetRef.current.x * 0.2;
        const targetPitch = targetRef.current.y * 0.1;

        // Time-based easing behaves consistently on 60 Hz and high-refresh displays.
        const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16.67;
        previousTime = time;
        const ease = 1 - Math.exp(-elapsed / 170);
        current.x += (targetYaw - current.x) * ease;
        current.y += (targetPitch - current.y) * ease;
        if (head) {
          head.rotation.y = headOriginRef.current.y + current.x;
          head.rotation.x = headOriginRef.current.x + current.y;
        }
        // Keep the authored pose: yaw only, with no lift or arm roll.
        // The mirrored instance needs the opposite local yaw.
        for (const hand of handsRef.current) {
          hand.object.rotation.y = hand.origin.y + current.x * hand.mirror * 0.3;
        }
        applicationRef.current?.requestRender();
        if (Math.abs(targetYaw - current.x) + Math.abs(targetPitch - current.y) > 0.0005) {
          frameRef.current = window.requestAnimationFrame(animateRig);
        } else {
          previousTime = 0;
        }
      }
    };

    let inViewport = true;
    const updateVisibility = () => {
      visibleRef.current = inViewport && !document.hidden;
      const application = applicationRef.current;
      if (!application) return;
      if (visibleRef.current) application.play();
      else application.stop();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      updateVisibility();
    });
    if (containerRef.current) observer.observe(containerRef.current);

    updatePreferences();
    precisePointer.addEventListener("change", updatePreferences);
    motion.addEventListener("change", updatePreferences);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("mouseleave", resetPointer);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      precisePointer.removeEventListener("change", updatePreferences);
      motion.removeEventListener("change", updatePreferences);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (loaded) return;
    const timeout = window.setTimeout(() => setLoaderVisible(false), 6000);
    return () => window.clearTimeout(timeout);
  }, [loaded]);

  const handleLoad = useCallback((application: Application) => {
    applicationRef.current = application;
    // Cursor tracking uses the head transform directly. getSplineEvents() is
    // unsafe for scenes without a Spline event handler, even after onLoad.
    application.setGlobalEvents(trackingRef.current);
    const head =
      application.findObjectByName("Head") ??
      application.findObjectByName("Head 2") ??
      application.findObjectByName("Neck");

    if (head) {
      headRef.current = head;
      headOriginRef.current = { x: head.rotation.x, y: head.rotation.y };
      if (containerRef.current) containerRef.current.dataset.headTarget = head.name;
    }

    // These are the two assembly roots in this scene: the original left hand
    // and its mirrored component instance. UUIDs avoid matching the shared
    // component definition or a similarly named mesh inside either assembly.
    handsRef.current = [
      application.findObjectById("101bc66e-ed93-4578-a9a5-56a2fa16bea7"),
      application.findObjectById("4d921147-0652-47bc-830a-a2d9eaffc590"),
    ].filter((object): object is SPEObject => Boolean(object)).map((object) => ({
      object,
      origin: { x: object.rotation.x, y: object.rotation.y, z: object.rotation.z },
      mirror: object.scale.x < 0 ? -1 : 1,
    }));

    setLoaded(true);
    setLoaderVisible(false);
    if (!visibleRef.current) application.stop();
  }, []);

  return (
    <div
      className={`hero-robot${loaded ? " is-loaded" : ""}`}
      ref={containerRef}
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
        onLoad={handleLoad}
      />
    </div>
  );
}
