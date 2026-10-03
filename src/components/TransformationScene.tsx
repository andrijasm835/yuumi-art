"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { transformation } from "@/content/site";

const makeupStages = [
  {
    number: "01",
    title: "TEN",
    text: "Ujednačena i pažljivo pripremljena baza.",
  },
  {
    number: "02",
    title: "OČI",
    text: "Definicija koja ističe pogled.",
  },
  {
    number: "03",
    title: "BOJA",
    text: "Boja, tekstura i završni akcenti.",
  },
  {
    number: "04",
    title: "FINALNI LOOK",
    text: "Sve se spaja u celinu.",
  },
];

function imagePositionStyle(position: { desktop: string; mobile: string }) {
  return {
    "--image-position-desktop": position.desktop,
    "--image-position-mobile": position.mobile,
  } as CSSProperties;
}

export function TransformationScene() {
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
        const camera = {
          ten: {
            scale: isMobile ? 1.03 : isTablet ? 1.02 : 1,
            xPercent: isMobile ? 0 : 0,
            yPercent: isMobile ? 0 : 0,
          },
          eyes: {
            scale: isMobile ? 1.08 : isTablet ? 1.1 : 1.12,
            xPercent: isMobile ? -2 : isTablet ? -3 : -4,
            yPercent: isMobile ? 4 : isTablet ? 3 : 2,
          },
          color: {
            scale: isMobile ? 1.1 : isTablet ? 1.13 : 1.16,
            xPercent: isMobile ? -1 : isTablet ? -2 : -3,
            yPercent: isMobile ? -4 : isTablet ? -5 : -6,
          },
          final: {
            scale: isMobile ? 1.04 : isTablet ? 1.04 : 1.03,
            xPercent: 0,
            yPercent: 0,
          },
        };
        const entrance = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: isMobile ? "+=210%" : isTablet ? "+=280%" : "+=360%",
            scrub: 1.15,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        entrance.fromTo(
          ".transformation-frame",
          { yPercent: isMobile ? 4 : isTablet ? 6 : 8, scale: isMobile ? 1.01 : isTablet ? 1.015 : 1.025, opacity: 0.78 },
          { yPercent: 0, scale: 1, opacity: 1, ease: "none" },
          0,
        );

        const showCopy = (index: number, at: number) => {
          tl.to(".stage-copy", { autoAlpha: 0, y: -22, duration: 0.16 }, at - 0.02)
            .fromTo(`.stage-copy-${index}`, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.24 }, at);
        };

        tl.set(".stage-copy", { autoAlpha: 0, y: 20 })
          .set(".transformation-spotlight, .final-shimmer", { autoAlpha: 0 })
          .set(".transformation-photo", camera.ten)
          .fromTo(".transformation-enter", { opacity: 0.88 }, { opacity: 0, duration: 0.36 }, 0);

        showCopy(0, 0.08);
        tl.to(".skin-spotlight", { autoAlpha: 0.36, duration: 0.28, ease: "power1.out" }, 0.22)
          .to(".skin-spotlight", { autoAlpha: 0.18, duration: 0.28 }, 0.62)
          .to(".stage-copy-0", { autoAlpha: 0, y: -24, duration: 0.18 }, 0.86);

        showCopy(1, 1.02);
        tl.to(".transformation-photo", { ...camera.eyes, duration: 0.58, ease: "power1.inOut" }, 0.92)
          .to(".skin-spotlight", { autoAlpha: 0, duration: 0.22 }, 0.94)
          .to(".eyes-spotlight", { autoAlpha: 0.42, duration: 0.34, ease: "power1.out" }, 1.14)
          .to(".eyes-spotlight", { autoAlpha: 0.2, duration: 0.36 }, 1.54)
          .to(".stage-copy-1", { autoAlpha: 0, y: -24, duration: 0.18 }, 1.82);

        showCopy(2, 2.02);
        tl.to(".transformation-photo", { ...camera.color, duration: 0.58, ease: "power1.inOut" }, 1.92)
          .to(".eyes-spotlight", { autoAlpha: 0, duration: 0.22 }, 1.94)
          .to(".color-spotlight", { autoAlpha: 0.46, duration: 0.34, ease: "power1.out" }, 2.14)
          .to(".transformation-tone", { autoAlpha: isMobile ? 0.26 : 0.32, duration: 0.42 }, 2.14)
          .to(".color-spotlight", { autoAlpha: 0.22, duration: 0.36 }, 2.54)
          .to(".stage-copy-2", { autoAlpha: 0, y: -24, duration: 0.18 }, 2.82);

        showCopy(3, 3.02);
        tl.to(".transformation-photo", { ...camera.final, duration: 0.58, ease: "power1.inOut" }, 2.92)
          .to(".color-spotlight", { autoAlpha: 0, duration: 0.2 }, 2.94)
          .to(".transformation-tone", { autoAlpha: isMobile ? 0.16 : 0.2, duration: 0.38 }, 2.96)
          .to(".final-shimmer", { autoAlpha: 0.55, xPercent: 140, duration: 0.45 }, 3.18)
          .to(".final-shimmer", { autoAlpha: 0, duration: 0.14 }, 3.62);

        return () => {
          entrance.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section className="scene-overlap relative h-[100dvh] overflow-hidden bg-[#201614] text-[#fff7ef] lg:h-screen" ref={scope}>
      <div className="camera absolute inset-0 overflow-hidden">
        <div className="transformation-frame absolute inset-0 origin-center will-change-transform">
          <Image
            src={transformation.image}
            alt={transformation.alt}
            fill
            priority
            sizes="100vw"
            className="responsive-image transformation-photo h-full w-full object-cover will-change-transform"
            style={imagePositionStyle(transformation.position)}
          />
          <div className="transformation-tone pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_38%,rgba(255,245,230,0.08),transparent_28%),linear-gradient(180deg,rgba(30,18,14,0.08),rgba(30,18,14,0.24))] opacity-0 mix-blend-soft-light" />
          <div className="transformation-spotlight skin-spotlight pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_48%_47%,rgba(255,232,205,0.34),transparent_34%),linear-gradient(90deg,rgba(22,15,12,0.42),transparent_42%,rgba(22,15,12,0.18))] opacity-0 mix-blend-screen" />
          <div className="transformation-spotlight eyes-spotlight pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_49%_36%,rgba(255,242,221,0.48),transparent_22%),linear-gradient(180deg,rgba(22,15,12,0.28),transparent_44%,rgba(22,15,12,0.36))] opacity-0 mix-blend-screen" />
          <div className="transformation-spotlight color-spotlight pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_42%_56%,rgba(174,73,78,0.32),transparent_20%),radial-gradient(ellipse_at_48%_64%,rgba(138,38,52,0.34),transparent_16%)] opacity-0 mix-blend-soft-light" />
          <div className="final-shimmer pointer-events-none absolute inset-y-[8%] left-[-20%] w-[24%] bg-[linear-gradient(100deg,transparent,rgba(255,248,239,0.22),transparent)] opacity-0 blur-sm mix-blend-screen" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#160f0c]/78 via-[#160f0c]/10 to-[#160f0c]/30" />
      </div>

      <div className="transformation-enter pointer-events-none absolute inset-0 z-20 bg-[#fff7ef]/18 backdrop-blur-[8px]" />
      <div className="relative z-30 flex h-full items-end px-5 pb-[calc(env(safe-area-inset-bottom)+1.75rem)] md:px-10 md:pb-14 lg:px-12 lg:pb-20">
        <div className="relative min-h-44 w-full max-w-[88vw] sm:min-h-52 md:max-w-2xl lg:min-h-64 lg:max-w-4xl">
          {makeupStages.map((stage, index) => (
            <div
              className={`stage-copy stage-copy-${index} absolute bottom-0 left-0 max-w-[min(88vw,44rem)] opacity-0`}
              key={stage.title}
            >
              <p className="text-sm font-bold tracking-[0.42em] text-[#d2af76]">{stage.number}</p>
              <h2 className="mt-2 font-serif text-[clamp(2.65rem,11.5vw,4.75rem)] leading-[0.88] md:text-[clamp(3.6rem,8vw,6rem)] md:leading-[0.84] lg:text-[clamp(4rem,9vw,9rem)] lg:leading-[0.82]">
                {stage.title === "FINALNI LOOK" ? (
                  <>
                    FINALNI
                    <br />
                    LOOK
                  </>
                ) : (
                  stage.title
                )}
              </h2>
              <p className="mt-3 max-w-[17rem] text-sm leading-6 text-[#f4dfd2] sm:text-base sm:leading-7 md:mt-4 md:max-w-sm md:text-lg md:leading-7 lg:mt-5 lg:max-w-md lg:text-xl lg:leading-8">{stage.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
