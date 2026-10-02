"use client";

import { useRef } from "react";
import Image from "next/image";
import { BeautyFace } from "@/components/BeautyFace";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { hero, makeupProps } from "@/content/site";

export function HeroExperience() {
  const scope = useRef<HTMLElement>(null);

  useGsapScene(scope, () => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
      },
      (context) => {
        const isMobile = context.conditions?.mobile;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: isMobile ? "+=140%" : "+=240%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(".hero-title-top", { xPercent: isMobile ? -8 : -18, opacity: 0, filter: "blur(10px)" }, 0)
          .to(".hero-title-bottom", { xPercent: isMobile ? 8 : 18, opacity: 0, filter: "blur(10px)" }, 0)
          .to(".hero-small", { y: 38, opacity: 0 }, 0)
          .to(".vanity-object-left", { x: isMobile ? -28 : -86, y: isMobile ? 24 : 64, rotate: -12 }, 0)
          .to(".vanity-object-right", { x: isMobile ? 28 : 82, y: isMobile ? -20 : -54, rotate: 14 }, 0)
          .to(".mirror-glow", { opacity: 1, scale: isMobile ? 1.22 : 1.65, xPercent: isMobile ? 10 : 28 }, 0.08)
          .to(".mirror", { scale: isMobile ? 4.7 : 7.6, yPercent: -1, borderRadius: "0%", ease: "power2.inOut" }, 0.2)
          .to(".mirror-photo", { scale: isMobile ? 1.16 : 1.32, filter: "blur(0px) saturate(1.12) brightness(1.08)" }, 0.2)
          .to(".vanity-object-left", { opacity: 0, filter: "blur(10px)" }, 0.38)
          .to(".vanity-object-right", { opacity: 0, filter: "blur(10px)" }, 0.38)
          .to(".mirror-plane", { opacity: 1, backdropFilter: isMobile ? "blur(4px)" : "blur(10px)", scale: 1 }, 0.46)
          .to(".mirror-plane", { opacity: 0, backdropFilter: "blur(0px)" }, 0.72)
          .to(".vanity", { scale: isMobile ? 1.08 : 1.28, opacity: 0 }, 0.68);

        return () => tl.kill();
      },
    );

    return () => mm.revert();
  });

  return (
    <section
      ref={scope}
      id="top"
      className="hero-experience relative h-svh overflow-hidden bg-[#f6ede4] text-[#241916] md:h-screen"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,250,245,0.94),rgba(232,210,190,0.58)_38%,rgba(151,112,88,0.18)_72%,rgba(54,35,31,0.08))]" />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#fffaf5] to-transparent" />

      <div className="relative z-10 flex h-full items-center justify-center px-5">
        <div className="vanity relative flex h-[min(76vh,760px)] w-[min(94vw,1120px)] items-center justify-center perspective-[1200px]">
          <div className="absolute inset-x-[28%] bottom-[5%] h-12 rounded-full bg-[#5d3a2f]/18 blur-2xl" />
          <div className="mirror glass-reflection relative z-20 aspect-[0.74] h-[72vh] max-h-[680px] min-h-[440px] overflow-hidden rounded-[48%_48%_42%_42%] border-[10px] border-[#c5a56d] bg-[#fff8ef] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),inset_0_0_34px_rgba(38,22,18,0.28),0_50px_150px_rgba(67,43,34,0.24)] before:absolute before:inset-[10px] before:z-30 before:rounded-[inherit] before:border before:border-[#2b1b18]/28 before:content-[''] after:absolute after:inset-[-18px] after:-z-10 after:rounded-[inherit] after:bg-[#f8e8d2]/30 after:blur-2xl after:content-['']">
            <div className="mirror-glow absolute inset-0 z-20 opacity-50 mix-blend-screen bg-[linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.78)_38%,transparent_56%)]" />
            <BeautyFace className="mirror-photo h-full w-full scale-105 blur-[1px]" />
            <div className="absolute inset-0 bg-[#2b211d]/10" />
          </div>

          <Image
            src={makeupProps.brush}
            alt="Makeup brush"
            width={110}
            height={260}
            className="vanity-object-left absolute bottom-[10%] left-[9%] z-30 h-[30vh] w-auto rotate-[-24deg] drop-shadow-2xl"
          />
          <Image
            src={makeupProps.compact}
            alt="Compact powder"
            width={170}
            height={170}
            className="vanity-object-left absolute bottom-[18%] left-[18%] z-20 h-[16vh] w-auto drop-shadow-xl"
          />
          <Image
            src={makeupProps.lipstick}
            alt="Lipstick"
            width={95}
            height={190}
            className="vanity-object-right absolute right-[12%] top-[23%] z-30 h-[24vh] w-auto rotate-[17deg] drop-shadow-2xl"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center text-center">
          <p className="hero-title-top text-xs font-bold tracking-[0.55em] text-[#6f1d2a]">
            {hero.label}
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2.85rem,15vw,12rem)] leading-[0.82] tracking-normal md:text-[clamp(4.4rem,13vw,12rem)] md:leading-[0.78]">
            <span className="hero-title-top block">{hero.headlineTop}</span>
            <span className="hero-title-bottom block italic">{hero.headlineBottom}</span>
          </h1>
          <p className="hero-small mt-8 text-[11px] font-bold tracking-[0.42em] text-[#70574b]">
            {hero.scrollPrompt}
          </p>
        </div>
      </div>

      <div className="mirror-plane pointer-events-none absolute inset-0 z-50 scale-95 bg-[#fff7ef]/26 opacity-0" />
    </section>
  );
}
