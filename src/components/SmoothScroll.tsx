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
    const useNativeScroll = window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 767px)").matches;
    let refreshTimer: number | undefined;
    const refresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 140);
    };
    const refreshAfterReady = () => window.setTimeout(refresh, 80);

    window.addEventListener("orientationchange", refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refreshAfterReady);
    document.fonts?.ready.then(refreshAfterReady).catch(() => undefined);

    if (prefersReducedMotion || useNativeScroll) {
      if (window.__yummiLenis) delete window.__yummiLenis;
      return () => {
        window.clearTimeout(refreshTimer);
        window.removeEventListener("orientationchange", refresh);
        window.removeEventListener("resize", refresh);
        window.removeEventListener("load", refreshAfterReady);
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
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("load", refreshAfterReady);
      gsap.ticker.remove(update);
      lenis.destroy();
      if (window.__yummiLenis === lenis) delete window.__yummiLenis;
    };
  }, []);

  return null;
}
