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
          y: isMobile ? 18 : 26,
          scale: isMobile ? 0.985 : 0.99,
        });

        gsap.set(".hero-small", {
          autoAlpha: 0,
          y: 10,
        });

        gsap.set(".hero-prop", {
          autoAlpha: 0,
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
              yPercent: isMobile ? -3 : isTablet ? -4 : -5,
              scale: isMobile ? 1.012 : isTablet ? 1.018 : 1.022,
              ease: "none",
            },
            0,
          )
          .to(
            ".hero-prop-left",
            {
              x: isMobile ? -18 : -42,
              y: isMobile ? 12 : 26,
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
              yPercent: isMobile ? -5 : -7,
              scale: isMobile ? 1.018 : 1.03,
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
      {/* MOBILE */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 md:hidden">
        <div className="hero-logo-visual relative aspect-square w-[92vw] overflow-hidden shadow-[0_28px_90px_rgba(36,25,22,0.12)]">
          <Image
            src="/yummi/hero-yuumi-logo.jpg"
            alt="Yuumi Art by Adriana — Makeup studio"
            fill
            priority
            quality={100}
            sizes="92vw"
            className="hero-logo-image object-cover object-center [transform:scaleX(1.03)]"
          />
        </div>

        <Image
          src={makeupProps.brush}
          alt=""
          aria-hidden="true"
          width={110}
          height={260}
          className="hero-prop hero-prop-left pointer-events-none absolute -bottom-[1dvh] left-[-4vw] h-[19dvh] w-auto rotate-[-25deg] opacity-75 drop-shadow-xl"
        />

        <Image
          src={makeupProps.lipstick}
          alt=""
          aria-hidden="true"
          width={95}
          height={190}
          className="hero-prop hero-prop-right pointer-events-none absolute right-[-2vw] top-[15dvh] h-[14dvh] w-auto rotate-[18deg] opacity-80 drop-shadow-xl"
        />
      </div>

      {/* TABLET / DESKTOP */}
      <div className="hero-logo-visual absolute inset-0 z-10 hidden overflow-hidden md:block">
        <Image
          src="/yummi/hero-yuumi-logo.jpg"
          alt="Yuumi Art by Adriana — Makeup studio"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="hero-logo-image object-cover object-center [transform:scaleX(1.03)]"
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,15,12,0.025),transparent_36%,rgba(22,15,12,0.055))]" />
      </div>

      {/* DECORATIVE PROPS — TABLET / DESKTOP */}
      <Image
        src={makeupProps.brush}
        alt=""
        aria-hidden="true"
        width={110}
        height={260}
        className="hero-prop hero-prop-left pointer-events-none absolute bottom-[3vh] left-[8vw] z-20 hidden h-[22vh] w-auto rotate-[-24deg] opacity-72 drop-shadow-xl md:block lg:left-[10vw] lg:h-[26vh]"
      />

      <Image
        src={makeupProps.lipstick}
        alt=""
        aria-hidden="true"
        width={95}
        height={190}
        className="hero-prop hero-prop-right pointer-events-none absolute right-[8vw] top-[12vh] z-20 hidden h-[18vh] w-auto rotate-[17deg] opacity-78 drop-shadow-xl md:block lg:right-[10vw] lg:h-[21vh]"
      />

      {/* SCROLL PROMPT */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1.8rem)] z-40 flex justify-center px-5 text-center sm:bottom-[6svh]">
        <p className="hero-small text-[10px] font-bold tracking-[0.42em] text-[#70574b] sm:text-[11px]">
          {hero.scrollPrompt}
        </p>
      </div>
    </section>
  );
}