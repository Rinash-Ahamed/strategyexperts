"use client";

import dynamic from "next/dynamic";
import type { Application, SPEObject } from "@splinetool/runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { ROBOT_SCENE_URL } from "@/lib/robot";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

type HandRig = {
  object: SPEObject;
  origin: { x: number; y: number; z: number };
  mirror: number;
};

export default function RobotHero({ onReady }: { onReady?: () => void } = {}) {
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
  const reducedMotionRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [mountScene, setMountScene] = useState(false);

  useEffect(() => {
    if (!loaded || !onReady) return;
    let nextFrame = 0;
    const frame = requestAnimationFrame(() => {
      nextFrame = requestAnimationFrame(onReady);
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(nextFrame);
    };
  }, [loaded, onReady]);

  useEffect(() => {
    // Let the server-rendered copy paint before evaluating the heavy 3D runtime.
    // The scene file still preloads immediately; only initialization yields.
    let firstFrame = 0;
    let secondFrame = 0;
    let cancelled = false;
    const mount = () => {
      if (cancelled) return;
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => setMountScene(true));
      });
    };
    // Do not compile shaders over the browser's short page-entry animation.
    // The HTML and navigation are already visible; only 3D startup yields.
    const transition = document.activeViewTransition;
    if (transition) void transition.finished.then(mount, mount);
    else mount();
    return () => {
      cancelled = true;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  useEffect(() => {
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px), (hover: none), (pointer: coarse)");
    let pointerX = 0;
    let pointerY = 0;
    let pointerPending = false;
    let previousTime = 0;
    const cancelTrackingFrame = () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      previousTime = 0;
      pointerPending = false;
    };
    const updatePreferences = () => {
      reducedMotionRef.current = motion.matches;
      trackingRef.current = precisePointer.matches && !motion.matches && !mobile.matches;
      if (containerRef.current) {
        containerRef.current.dataset.headTracking = trackingRef.current ? "enabled" : "disabled";
        containerRef.current.dataset.renderMode = motion.matches ? "idle" : "animated";
      }

      if (!trackingRef.current) {
        cancelTrackingFrame();
        targetRef.current.x = targetRef.current.y = 0;
        currentRef.current.x = currentRef.current.y = 0;
        for (const hand of handsRef.current) {
          Object.assign(hand.object.rotation, hand.origin);
        }
        if (headRef.current) Object.assign(headRef.current.rotation, headOriginRef.current);
        applicationRef.current?.requestRender();
      }
      applicationRef.current?.setGlobalEvents(trackingRef.current);
      window.removeEventListener("pointermove", updatePointer);
      if (trackingRef.current) window.addEventListener("pointermove", updatePointer, { passive: true });
      if (motion.matches || !visibleRef.current) applicationRef.current?.stop();
      else if (visibleRef.current) applicationRef.current?.play();
    };

    const updatePointer = (event: PointerEvent) => {
      if (!trackingRef.current || !visibleRef.current || reducedMotionRef.current || event.pointerType === "touch") return;

      // A high-polling mouse can dispatch many events per display frame. Store
      // only the latest coordinates; read layout once in the rig frame below.
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerPending = true;
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(animateRig);
      }
    };

    const resetPointer = () => {
      pointerPending = false;
      targetRef.current.x = targetRef.current.y = 0;
      if (trackingRef.current && visibleRef.current && frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(animateRig);
      }
    };

    const animateRig = (time: number) => {
      frameRef.current = null;
      const head = headRef.current;

      if (pointerPending) {
        pointerPending = false;
        const bounds = containerRef.current?.getBoundingClientRect();
        const target = targetRef.current;
        if (bounds?.width && bounds.height && pointerX >= bounds.left && pointerX <= bounds.right && pointerY >= bounds.top && pointerY <= bounds.bottom) {
          target.x = ((pointerX - bounds.left) / bounds.width) * 2 - 1;
          target.y = ((pointerY - bounds.top) / bounds.height) * 2 - 1;
        } else {
          target.x = target.y = 0;
        }
      }

      if ((head || handsRef.current.length) && trackingRef.current && visibleRef.current && !reducedMotionRef.current) {
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
    const main = document.getElementById("main");
    const updateVisibility = () => {
      visibleRef.current = inViewport && !document.hidden && !main?.inert;
      const application = applicationRef.current;
      if (!visibleRef.current) cancelTrackingFrame();
      if (!application) return;
      if (visibleRef.current && !reducedMotionRef.current) application.play();
      else application.stop();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      updateVisibility();
    });
    const hidePage = (event: PageTransitionEvent) => {
      visibleRef.current = false;
      cancelTrackingFrame();
      const application = applicationRef.current;
      application?.stop();
      // Keep BFCache documents resumable; release the GPU on a real unload.
      if (!event.persisted && application) {
        applicationRef.current = null;
        headRef.current = null;
        handsRef.current = [];
        application.dispose();
      }
    };
    if (containerRef.current) observer.observe(containerRef.current);
    // The mobile menu makes the covered page inert. Avoid rendering behind it.
    const menuObserver = new MutationObserver(updateVisibility);
    if (main) menuObserver.observe(main, { attributes: true, attributeFilter: ["inert"] });

    updatePreferences();
    precisePointer.addEventListener("change", updatePreferences);
    motion.addEventListener("change", updatePreferences);
    mobile.addEventListener("change", updatePreferences);
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("mouseleave", resetPointer);
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("pagehide", hidePage);
    window.addEventListener("pageshow", updateVisibility);

    return () => {
      precisePointer.removeEventListener("change", updatePreferences);
      motion.removeEventListener("change", updatePreferences);
      mobile.removeEventListener("change", updatePreferences);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("pagehide", hidePage);
      window.removeEventListener("pageshow", updateVisibility);
      observer.disconnect();
      menuObserver.disconnect();
      cancelTrackingFrame();
    };
  }, []);

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
    if (containerRef.current) containerRef.current.dataset.loadedAt = performance.now().toFixed(1);
    if (!visibleRef.current || reducedMotionRef.current) application.stop();
  }, []);

  return (
    <div
      className={`hero-robot${loaded ? " is-loaded" : ""}`}
      ref={containerRef}
      aria-hidden="true"
    >
      <div className="hero-robot-light" />
      {mountScene && <Spline
        className="hero-robot-canvas"
        scene={ROBOT_SCENE_URL}
        onLoad={handleLoad}
      />}
    </div>
  );
}
