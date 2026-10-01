"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/useGsapScene";

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!cursor.current || window.matchMedia("(pointer: coarse)").matches) return;

    const quickX = gsap.quickTo(cursor.current, "x", {
      duration: 0.35,
      ease: "power3",
    });
    const quickY = gsap.quickTo(cursor.current, "y", {
      duration: 0.35,
      ease: "power3",
    });

    const move = (event: PointerEvent) => {
      quickX(event.clientX);
      quickY(event.clientY);
    };

    const enter = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      setLabel(target.dataset.cursor ?? "");
      gsap.to(cursor.current, { scale: target.dataset.cursor ? 1.9 : 1.25, duration: 0.2 });
    };
    const leave = () => {
      setLabel("");
      gsap.to(cursor.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("pointermove", move);
    const targets = document.querySelectorAll<HTMLElement>("[data-cursor], a, button");
    targets.forEach((target) => {
      target.addEventListener("mouseenter", enter);
      target.addEventListener("mouseleave", leave);
    });

    return () => {
      window.removeEventListener("pointermove", move);
      targets.forEach((target) => {
        target.removeEventListener("mouseenter", enter);
        target.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <div
      ref={cursor}
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#2b211d]/30 bg-[#fffaf5]/20 text-[8px] font-bold tracking-[0.18em] text-[#2b211d] mix-blend-multiply backdrop-blur-sm md:flex"
    >
      {label}
    </div>
  );
}
