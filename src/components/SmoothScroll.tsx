"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import { shouldResizeScenes } from "@/lib/scrollCadence";
import "lenis/dist/lenis.css";
import { ScrollTrigger, gsap } from "@/lib/useGsapScene";

declare global {
  interface Window {
    __yummiLenis?: Lenis;
  }
}

export function SmoothScroll() {
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useNativeScroll = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let refreshTimer: number | undefined;
    let disposed = false;

    // Own refresh scheduling: mobile browser chrome must not resize pinned scenes.
    ScrollTrigger.config({ autoRefreshEvents: "none", ignoreMobileResize: true });
    const setStableSceneHeight = () => {
      document.documentElement.style.setProperty("--scene-vh", `${window.innerHeight}px`);
    };
    setStableSceneHeight();

    const refresh = () => {
      if (disposed) return;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        // Safe refresh waits until an active swipe has finished.
        ScrollTrigger.refresh(true);
      }, 180);
    };
    const resize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      if (!shouldResizeScenes({ width: viewportWidth, height: viewportHeight }, { width: nextWidth, height: nextHeight }, useNativeScroll)) return;
      viewportWidth = nextWidth;
      viewportHeight = nextHeight;
      setStableSceneHeight();
      refresh();
    };
    const restore = () => {
      if (document.visibilityState === "visible") resize();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("load", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", restore);
    document.fonts?.ready.then(refresh).catch(() => undefined);
    // Also covers mounting after the load event and the initial pin measurements.
    refresh();

    // Touch keeps the browser's single native momentum curve. Scrubbed animations
    // follow it directly instead of applying a second, independent easing layer.
    const lenis = !prefersReducedMotion && !useNativeScroll ? new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    }) : undefined;
    const update = (time: number) => lenis?.raf(time * 1000);
    if (lenis) {
      window.__yummiLenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(update);
    }

    return () => {
      disposed = true;
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", restore);
      gsap.ticker.remove(update);
      lenis?.destroy();
      if (window.__yummiLenis === lenis) delete window.__yummiLenis;
      ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize", ignoreMobileResize: false });
    };
  }, []);

  return null;
}
