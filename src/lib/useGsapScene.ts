"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapScene<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: () => void | (() => void),
) {
  const setupRef = useRef(setup);

  useLayoutEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  useLayoutEffect(() => {
    if (!scope.current) return;

    let cleanup: void | (() => void);
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      cleanup = setupRef.current();
    }, scope);

    return () => {
      cleanup?.();
      context.revert();
    };
  }, [scope]);
}

export { gsap, ScrollTrigger };
