"use client";

import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { ScrollTrigger, gsap } from "@/lib/useGsapScene";
import { brand } from "@/content/site";

const links = [
  ["RADOVI", "#work"],
  ["O MENI", "#about"],
  ["ZAKAŽI", "#book"],
];

export function Navigation() {
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!nav.current) return;

    const tween = gsap.fromTo(
      nav.current,
      { y: -24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: ".hero-experience",
          start: "bottom 82%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const scrollTo = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    ScrollTrigger.refresh();
    const sceneTrigger = ScrollTrigger.getAll().find((trigger) => trigger.trigger === target);
    const destination = sceneTrigger?.start ?? (target as HTMLElement);
    window.__yummiLenis?.scrollTo(destination, { offset: 0, duration: 1.2 });
    if (!window.__yummiLenis) {
      if (typeof destination === "number") window.scrollTo({ top: destination, behavior: "smooth" });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      ref={nav}
      className="fixed left-1/2 top-5 z-[80] flex w-[min(92vw,1040px)] -translate-x-1/2 items-center justify-between opacity-0"
    >
      <a className="text-xs font-semibold tracking-[0.34em] outline-none focus-visible:ring-2 focus-visible:ring-[#6f1d2a]" href="#top" onClick={(event) => scrollTo(event, "#top")}>
        {brand.navName}
      </a>
      <div className="flex items-center gap-5 text-[11px] font-semibold tracking-[0.28em] text-[#4d3b33] md:gap-8">
        {links.map(([label, href]) => (
          <a className="nav-link outline-none focus-visible:ring-2 focus-visible:ring-[#6f1d2a]" href={href} key={label} onClick={(event) => scrollTo(event, href)}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
