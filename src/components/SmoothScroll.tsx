"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger, gsap } from "@/lib/useGsapScene";

declare global {
  interface Window {
    __yummiLenis?: Lenis;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const useNativeScroll = coarsePointer || window.matchMedia("(max-width: 767px)").matches;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let orientation = window.screen.orientation?.type ?? `${window.innerWidth > window.innerHeight ? "landscape" : "portrait"}`;
    let refreshTimer: number | undefined;

    const setStableSceneHeight = () => {
      document.documentElement.style.setProperty("--scene-vh", `${window.innerHeight}px`);
    };

    const refresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 140);
    };
    const refreshAfterReady = () => window.setTimeout(() => {
      setStableSceneHeight();
      refresh();
    }, 80);

    const refreshForOrientation = () => {
      window.setTimeout(() => {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
        orientation = window.screen.orientation?.type ?? `${window.innerWidth > window.innerHeight ? "landscape" : "portrait"}`;
        setStableSceneHeight();
        refresh();
      }, 220);
    };

    const refreshForResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const nextOrientation = window.screen.orientation?.type ?? `${nextWidth > nextHeight ? "landscape" : "portrait"}`;
      const widthDelta = Math.abs(nextWidth - viewportWidth);
      const heightDelta = Math.abs(nextHeight - viewportHeight);
      const orientationChanged = nextOrientation !== orientation;

      if (useNativeScroll) {
        if (orientationChanged || widthDelta >= 24) {
          viewportWidth = nextWidth;
          viewportHeight = nextHeight;
          orientation = nextOrientation;
          setStableSceneHeight();
          refresh();
        }
        return;
      }

      viewportWidth = nextWidth;
      viewportHeight = nextHeight;
      orientation = nextOrientation;
      if (widthDelta > 0 || heightDelta > 0) refresh();
    };

    const refreshAfterTabRestore = () => {
      if (document.visibilityState !== "visible") return;
      window.setTimeout(() => {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
        orientation = window.screen.orientation?.type ?? `${window.innerWidth > window.innerHeight ? "landscape" : "portrait"}`;
        setStableSceneHeight();
        refresh();
      }, 180);
    };

    setStableSceneHeight();
    window.addEventListener("orientationchange", refreshForOrientation);
    window.addEventListener("resize", refreshForResize);
    window.addEventListener("load", refreshAfterReady);
    document.addEventListener("visibilitychange", refreshAfterTabRestore);
    document.fonts?.ready.then(refreshAfterReady).catch(() => undefined);

    if (prefersReducedMotion || useNativeScroll) {
      if (window.__yummiLenis) delete window.__yummiLenis;
      return () => {
        window.clearTimeout(refreshTimer);
        window.removeEventListener("orientationchange", refreshForOrientation);
        window.removeEventListener("resize", refreshForResize);
        window.removeEventListener("load", refreshAfterReady);
        document.removeEventListener("visibilitychange", refreshAfterTabRestore);
      };
    }

    const lenis = new Lenis({
      duration: 1.18,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__yummiLenis = lenis;

    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", refreshForResize);
      window.removeEventListener("orientationchange", refreshForOrientation);
      window.removeEventListener("load", refreshAfterReady);
      document.removeEventListener("visibilitychange", refreshAfterTabRestore);
      gsap.ticker.remove(update);
      lenis.destroy();
      if (window.__yummiLenis === lenis) delete window.__yummiLenis;
    };
  }, []);

  return null;
}
