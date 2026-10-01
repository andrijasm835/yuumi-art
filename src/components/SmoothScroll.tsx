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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    const refresh = () => ScrollTrigger.refresh();
    const refreshAfterReady = () => window.setTimeout(refresh, 80);
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("load", refreshAfterReady);
    document.fonts?.ready.then(refreshAfterReady).catch(() => undefined);

    return () => {
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
