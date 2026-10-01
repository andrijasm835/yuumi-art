"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/useGsapScene";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bar.current) return;

    const tween = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[90] h-px w-full bg-black/5">
      <div
        ref={bar}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-[#6f1d2a] via-[#c7a86b] to-[#f2e9dd]"
      />
    </div>
  );
}
