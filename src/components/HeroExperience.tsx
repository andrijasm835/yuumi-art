"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { hero } from "@/content/site";
import { viewportScrollDistance } from "@/lib/scrollCadence";

export function HeroExperience() {
  const scope = useRef<HTMLElement>(null);

  useGsapScene(scope, () => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1024px)",
        tablet: "(min-width: 768px) and (max-width: 1023px)",
        mobile: "(max-width: 767px)",
      },
      (context) => {
        const isMobile = context.conditions?.mobile;
        const isTablet = context.conditions?.tablet;

        gsap.set(".hero-brand", {
          autoAlpha: 0,
          y: isMobile ? 16 : 24,
          scale: isMobile ? 0.985 : 0.975,
        });

        gsap.set(".hero-small", {
          autoAlpha: 0,
          y: 10,
        });

        const intro = gsap.timeline();

        intro
          .to(".hero-brand", {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
          })
          .to(
            ".hero-small",
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            0.25,
          );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: isMobile
              ? viewportScrollDistance(1)
              : isTablet
                ? viewportScrollDistance(1.7, 0.9)
                : "+=240%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          ".hero-small",
          {
            y: isMobile ? 14 : 24,
            opacity: 0,
            ease: "none",
          },
          0,
        )
          .to(
            ".hero-brand",
            {
              yPercent: isMobile ? -3 : isTablet ? -4 : -6,
              scale: isMobile ? 1.012 : isTablet ? 1.02 : 1.028,
              ease: "none",
            },
            0,
          )
          .to(
            ".hero-brand",
            {
              opacity: 0,
              yPercent: isMobile ? -6 : -9,
              scale: isMobile ? 1.02 : 1.04,
              ease: "none",
            },
            0.72,
          );

        return () => {
          intro.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section
      ref={scope}
      id="top"
      className="hero-experience relative h-[100dvh] overflow-hidden bg-[#eee8dc] text-[#241916]"
    >
      {/* FULLSCREEN FUR BACKGROUND */}
      <Image
        src="/yummi/hero-fur-bg.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Very subtle overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#fff7ef]/[0.02]" />

      {/* BRAND LOCKUP */}
      <div className="hero-brand absolute inset-0 z-20 flex flex-col items-center justify-center px-5 text-center">
        {/* Red YUUMIART logo */}
        <div className="relative w-[82vw] max-w-[860px] md:w-[64vw] lg:w-[56vw]">
          <Image
            src="/yummi/hero-logo-red.png"
            alt="Yuumi Art"
            width={2000}
            height={700}
            priority
            quality={100}
            sizes="(max-width: 767px) 82vw, (max-width: 1023px) 64vw, 56vw"
            className="h-auto w-full object-contain"
          />
        </div>

        {/* BY ADRIANA / Makeup studio */}
        <div className="relative mt-2 w-[44vw] max-w-[360px] md:mt-3 md:w-[26vw] lg:w-[21vw]">
          <Image
            src="/yummi/hero-by-adriana.png"
            alt="By Adriana — Makeup studio"
            width={1200}
            height={420}
            priority
            quality={100}
            sizes="(max-width: 767px) 44vw, (max-width: 1023px) 26vw, 21vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>

      {/* SCROLL PROMPT */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1.8rem)] z-40 flex justify-center px-5 text-center sm:bottom-[6svh]">
        <p className="hero-small text-[10px] font-bold tracking-[0.42em] text-[#6f1d2a] drop-shadow-[0_1px_8px_rgba(255,247,239,0.9)] sm:text-[11px]">
          {hero.scrollPrompt}
        </p>
      </div>
    </section>
  );
}