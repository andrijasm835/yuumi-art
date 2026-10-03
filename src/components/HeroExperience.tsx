"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { hero, makeupProps } from "@/content/site";

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
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: isMobile ? "+=120%" : isTablet ? "+=170%" : "+=240%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(".hero-title-top", { xPercent: isMobile ? -6 : isTablet ? -12 : -18, opacity: 0, filter: isMobile ? "none" : "blur(10px)" }, 0)
          .to(".hero-title-bottom", { xPercent: isMobile ? 6 : isTablet ? 12 : 18, opacity: 0, filter: isMobile ? "none" : "blur(10px)" }, 0)
          .to(".hero-small", { y: 38, opacity: 0 }, 0)
          .to(".vanity-object-left", { x: isMobile ? -20 : isTablet ? -50 : -86, y: isMobile ? 18 : isTablet ? 40 : 64, rotate: -12 }, 0)
          .to(".vanity-object-right", { x: isMobile ? 20 : isTablet ? 48 : 82, y: isMobile ? -16 : isTablet ? -32 : -54, rotate: 14 }, 0)
          .to(".vanity-object-center", { x: isMobile ? 4 : isTablet ? 12 : 20, y: isMobile ? 24 : isTablet ? 38 : 54, rotate: -5 }, 0)
          .to(".vanity-object-thin", { x: isMobile ? -12 : isTablet ? -28 : -46, y: isMobile ? -18 : isTablet ? -32 : -48, rotate: 8 }, 0)
          .to(".mirror-glow", { opacity: 1, scale: isMobile ? 1.18 : isTablet ? 1.36 : 1.65, xPercent: isMobile ? 7 : isTablet ? 16 : 28 }, 0.08)
          .to(".mirror", isMobile ? { scale: 1.45, opacity: 1, yPercent: 0, ease: "power2.inOut" } : { scale: isTablet ? 5.6 : 7.6, yPercent: -1, borderRadius: "0%", ease: "power2.inOut" }, 0.15)
          .to(".mirror-photo", { scale: isMobile ? 1.02 : isTablet ? 1.2 : 1.32, filter: isMobile ? "none" : "blur(0px) saturate(1.12) brightness(1.08)" }, 0.2)
          .to(".mobile-mirror-transition", isMobile ? { opacity: 1, scale: 1, ease: "power1.inOut" } : { opacity: 0 }, 0.28)
          .to(".mirror", isMobile ? { opacity: 0, scale: 1.5, ease: "power1.inOut" } : { opacity: 1 }, 0.48)
          .to(".vanity-object-left", { opacity: 0, filter: isMobile ? "none" : "blur(10px)" }, 0.38)
          .to(".vanity-object-right", { opacity: 0, filter: isMobile ? "none" : "blur(10px)" }, 0.38)
          .to(".vanity-object-center, .vanity-object-thin", { opacity: 0, filter: isMobile ? "none" : "blur(8px)" }, 0.42)
          .to(".mirror-plane", isMobile ? { opacity: 0, backdropFilter: "blur(0px)", scale: 1 } : { opacity: 1, backdropFilter: "blur(10px)", scale: 1 }, isMobile ? 0.58 : 0.46)
          .to(".mirror-plane", { opacity: 0, backdropFilter: "blur(0px)" }, 0.72)
          .to(".vanity", { scale: isMobile ? 1.04 : isTablet ? 1.16 : 1.28, opacity: 0 }, 0.68);

        return () => tl.kill();
      },
    );

    return () => mm.revert();
  });

  return (
    <section
      ref={scope}
      id="top"
      className="hero-experience relative h-[100dvh] overflow-hidden bg-[#f6ede4] text-[#241916]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,250,245,0.94),rgba(232,210,190,0.58)_38%,rgba(151,112,88,0.18)_72%,rgba(54,35,31,0.08))]" />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#fffaf5] to-transparent" />
      <div className="mobile-mirror-transition pointer-events-none absolute inset-0 z-[9] scale-[1.01] bg-[radial-gradient(circle_at_52%_28%,rgba(255,255,255,0.68),transparent_22%),radial-gradient(circle_at_34%_70%,rgba(216,189,128,0.24),transparent_34%),linear-gradient(135deg,#fff8ef_0%,#ead8c2_42%,#c7a982_68%,#f8efe4_100%)] opacity-0 md:hidden">
        <div className="absolute left-[8%] top-[16%] h-[32%] w-[58%] rotate-[-16deg] rounded-full bg-white/16" />
        <div className="absolute bottom-[12%] right-[5%] h-[34%] w-[42%] rotate-12 rounded-full bg-[#6f1d2a]/8" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_16%,rgba(255,255,255,0.46)_38%,transparent_58%)] opacity-70 mix-blend-screen" />
        <div className="absolute inset-0 bg-[#2b211d]/5" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-5">
        <div className="vanity relative flex h-[min(70svh,760px)] w-[min(94vw,1120px)] items-center justify-center perspective-[1200px] sm:h-[min(74svh,760px)] lg:h-[min(76vh,760px)]">
          <div className="absolute inset-x-[28%] bottom-[5%] h-12 rounded-full bg-[#5d3a2f]/18 blur-2xl" />
          <div className="mirror glass-reflection relative z-20 aspect-[0.74] h-[62svh] max-h-[680px] min-h-[330px] overflow-hidden rounded-[48%_48%_42%_42%] border-[8px] border-[#c5a56d] bg-[#fff8ef] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),inset_0_0_34px_rgba(38,22,18,0.28),0_50px_150px_rgba(67,43,34,0.24)] before:absolute before:inset-[10px] before:z-30 before:rounded-[inherit] before:border before:border-[#2b1b18]/28 before:content-[''] after:absolute after:inset-[-18px] after:-z-10 after:rounded-[inherit] after:bg-[#f8e8d2]/30 after:blur-2xl after:content-[''] sm:h-[68svh] md:min-h-[430px] lg:h-[72vh] lg:min-h-[440px] lg:border-[10px]">
            <div className="mirror-photo absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_52%_28%,rgba(255,255,255,0.74),transparent_20%),radial-gradient(circle_at_34%_70%,rgba(216,189,128,0.24),transparent_32%),linear-gradient(135deg,#fff8ef_0%,#ead8c2_42%,#c7a982_68%,#f8efe4_100%)]" />
            <div className="absolute left-[12%] top-[18%] h-[34%] w-[52%] rotate-[-16deg] rounded-full bg-white/20" />
            <div className="absolute bottom-[12%] right-[8%] h-[30%] w-[38%] rotate-12 rounded-full bg-[#6f1d2a]/8" />
            <div className="mirror-glow absolute inset-0 z-20 rounded-[inherit] opacity-60 mix-blend-screen bg-[linear-gradient(120deg,transparent_16%,rgba(255,255,255,0.72)_36%,transparent_54%)]" />
            <div className="absolute inset-[8%] rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.20),transparent_48%,rgba(43,27,24,0.10))]" />
            <div className="absolute inset-0 rounded-[inherit] bg-[#2b211d]/6" />
          </div>

          <Image
            src={makeupProps.brush}
            alt="Makeup brush"
            width={110}
            height={260}
            className="vanity-object-left absolute bottom-[8%] left-[2%] z-30 h-[22svh] w-auto rotate-[-24deg] drop-shadow-2xl sm:left-[7%] sm:h-[27svh] lg:bottom-[10%] lg:left-[9%] lg:h-[30vh]"
          />
          <Image
            src={makeupProps.compact}
            alt="Compact powder"
            width={170}
            height={170}
            className="vanity-object-left absolute bottom-[18%] left-[12%] z-20 h-[12svh] w-auto drop-shadow-xl sm:left-[18%] sm:h-[15svh] lg:h-[16vh]"
          />
          <Image
            src={makeupProps.lipstick}
            alt="Lipstick"
            width={95}
            height={190}
            className="vanity-object-right absolute right-[4%] top-[21%] z-30 h-[18svh] w-auto rotate-[17deg] drop-shadow-2xl sm:right-[10%] sm:h-[22svh] lg:right-[12%] lg:top-[23%] lg:h-[24vh]"
          />
          <Image
            src={makeupProps.sponge}
            alt="Beauty sponge"
            width={110}
            height={150}
            className="vanity-object-center absolute bottom-[10%] right-[9%] z-20 h-[10svh] w-auto rotate-[14deg] opacity-85 drop-shadow-xl sm:right-[18%] sm:h-[12svh] lg:bottom-[12%] lg:right-[20%] lg:h-[13vh]"
          />
          <Image
            src={makeupProps.mascara}
            alt="Mascara"
            width={60}
            height={260}
            className="vanity-object-thin absolute left-[4%] top-[14%] z-10 hidden h-[19svh] w-auto rotate-[64deg] opacity-70 drop-shadow-lg sm:block lg:left-[4%] lg:top-[13%] lg:h-[22vh]"
          />
          <Image
            src={makeupProps.eyeliner}
            alt="Eyeliner"
            width={250}
            height={44}
            className="vanity-object-thin absolute bottom-[5%] right-[3%] z-10 h-[4.2svh] w-auto rotate-[-13deg] opacity-65 drop-shadow-lg sm:right-[10%] sm:h-[4.8svh] lg:bottom-[6%] lg:right-[13%] lg:h-[5vh]"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center text-center">
          <p className="hero-title-top text-xs font-bold tracking-[0.55em] text-[#6f1d2a]">
            {hero.label}
          </p>
          <h1 className="mt-4 max-w-[94vw] font-serif text-[clamp(2.55rem,13.2vw,5.4rem)] leading-[0.86] tracking-normal sm:text-[clamp(3.2rem,12vw,7rem)] md:text-[clamp(4rem,10vw,9rem)] md:leading-[0.8] lg:mt-5 lg:text-[clamp(4.4rem,13vw,12rem)] lg:leading-[0.78]">
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
