"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { hero, makeupProps } from "@/content/site";
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

        gsap.set(".hero-logo-visual", {
          autoAlpha: 0,
          y: isMobile ? 18 : 28,
          scale: isMobile ? 0.985 : 0.97,
        });

        gsap.set(".hero-small", {
          autoAlpha: 0,
          y: 10,
        });

        gsap.set(".hero-prop", {
          autoAlpha: 0,
        });

        gsap.set(".hero-logo-image", {
          scale: 1.055,
        });

        const intro = gsap.timeline();

        intro
          .to(".hero-logo-visual", {
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
              duration: 0.55,
              ease: "power2.out",
            },
            0.28,
          )
          .to(
            ".hero-prop",
            {
              autoAlpha: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "power2.out",
            },
            0.18,
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
            y: isMobile ? 16 : 28,
            opacity: 0,
            ease: "none",
          },
          0,
        )
          .to(
            ".hero-logo-visual",
            {
              yPercent: isMobile ? -3 : isTablet ? -5 : -7,
              scale: isMobile ? 1.015 : isTablet ? 1.035 : 1.055,
              ease: "none",
            },
            0,
          )
          .to(
            ".hero-logo-image",
            {
              yPercent: isMobile ? 0.8 : 1.5,
              scale: isMobile ? 1.06 : isTablet ? 1.065 : 1.07,
              ease: "none",
            },
            0,
          )
          .to(
            ".hero-prop-left",
            {
              x: isMobile ? -16 : -42,
              y: isMobile ? 12 : 28,
              rotate: -8,
              opacity: 0,
              ease: "none",
            },
            0.12,
          )
          .to(
            ".hero-prop-right",
            {
              x: isMobile ? 18 : 44,
              y: isMobile ? -10 : -24,
              rotate: 9,
              opacity: 0,
              ease: "none",
            },
            0.12,
          )
          .to(
            ".hero-logo-visual",
            {
              opacity: 0,
              yPercent: isMobile ? -6 : -10,
              scale: isMobile ? 1.025 : 1.07,
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
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,250,245,0.95),rgba(238,232,220,0.82)_48%,rgba(216,189,128,0.15)_100%)]" />

      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fffaf5]/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#eee8dc] to-transparent" />

      {/* Main composition */}
      <div className="relative z-10 flex h-full items-center justify-center px-5">
        <div className="relative flex h-full w-full items-center justify-center">

          {/* Main logo artwork */}
          <div className="hero-logo-visual relative aspect-square w-[min(88vw,70dvh)] max-w-[780px] overflow-hidden shadow-[0_30px_100px_rgba(36,25,22,0.14)] sm:w-[min(78vw,72dvh)] md:w-[min(68vw,72dvh)] lg:w-[min(58vw,76vh)]">
            <Image
              src="/yummi/hero-yuumi-logo.jpg"
              alt="Yuumi Art by Adriana — Makeup studio"
              fill
              priority
              quality={95}
              sizes="(max-width: 767px) 88vw, (max-width: 1023px) 68vw, 58vw"
              className="hero-logo-image object-cover object-center"
            />

            <div className="pointer-events-none absolute inset-0 border border-[#d8bd80]/15" />
          </div>

          {/* Subtle brand props */}
          <Image
            src={makeupProps.brush}
            alt=""
            aria-hidden="true"
            width={110}
            height={260}
            className="hero-prop hero-prop-left pointer-events-none absolute -bottom-[1dvh] left-[-4vw] h-[19dvh] w-auto rotate-[-25deg] opacity-75 drop-shadow-xl sm:left-[4vw] sm:h-[22dvh] md:left-[8vw] lg:left-[12vw] lg:h-[26vh]"
          />

          <Image
            src={makeupProps.lipstick}
            alt=""
            aria-hidden="true"
            width={95}
            height={190}
            className="hero-prop hero-prop-right pointer-events-none absolute right-[-2vw] top-[15dvh] h-[14dvh] w-auto rotate-[18deg] opacity-80 drop-shadow-xl sm:right-[5vw] sm:h-[17dvh] md:right-[9vw] lg:right-[14vw] lg:h-[20vh]"
          />

          <Image
            src={makeupProps.sponge}
            alt=""
            aria-hidden="true"
            width={110}
            height={150}
            className="hero-prop hero-prop-right pointer-events-none absolute bottom-[8dvh] right-[4vw] hidden h-[9dvh] w-auto rotate-[12deg] opacity-55 sm:block md:right-[12vw] lg:right-[18vw] lg:h-[11vh]"
          />
        </div>

        {/* Scroll prompt */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1.8rem)] z-40 flex justify-center px-5 text-center sm:bottom-[6svh]">
          <p className="hero-small text-[10px] font-bold tracking-[0.42em] text-[#70574b] sm:text-[11px]">
            {hero.scrollPrompt}
          </p>
        </div>
      </div>
    </section>
  );
}