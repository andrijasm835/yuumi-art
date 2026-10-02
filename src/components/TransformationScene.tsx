"use client";

import { useRef } from "react";
import { BeautyFace } from "@/components/BeautyFace";
import { useGsapScene, gsap } from "@/lib/useGsapScene";

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
          { yPercent: isMobile ? 4 : isTablet ? 6 : 8, scale: isMobile ? 1.01 : isTablet ? 1.02 : 1.035, opacity: 0.78 },
          { yPercent: 0, scale: 1, opacity: 1, ease: "none" },
          0,
        );

        const showCopy = (index: number, at: number) => {
          tl.to(".stage-copy", { autoAlpha: 0, y: -22, duration: 0.16 }, at - 0.02)
            .fromTo(`.stage-copy-${index}`, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.24 }, at);
        };

        tl.set(".stage-copy", { autoAlpha: 0, y: 20 })
          .set(".stage-eyes, .stage-color, .stage-final", { autoAlpha: 0 })
          .set(".final-shimmer", { autoAlpha: 0 })
          .fromTo(".transformation-enter", { opacity: 0.88 }, { opacity: 0, duration: 0.36 }, 0);

        showCopy(0, 0.08);
        tl.to(".stage-copy-0", { autoAlpha: 0, y: -24, duration: 0.18 }, 0.82);

        showCopy(1, 1.02);
        tl.to(".transformation-frame", { scale: isMobile ? 1.012 : isTablet ? 1.025 : 1.04, xPercent: isMobile ? 0 : isTablet ? -0.5 : -1, yPercent: isMobile ? -0.5 : 0, duration: 0.38 }, 0.92)
          .to(".stage-eyes", { autoAlpha: 1, duration: 0.34, ease: "power1.out" }, 1.14)
          .to(".stage-copy-1", { autoAlpha: 0, y: -24, duration: 0.18 }, 1.82);

        showCopy(2, 2.02);
        tl.to(".transformation-frame", { scale: isMobile ? 1.01 : isTablet ? 1.018 : 1.03, xPercent: isMobile ? 0 : isTablet ? 0.5 : 1, yPercent: 0, duration: 0.38 }, 1.92)
          .to(".stage-color", { autoAlpha: 1, duration: 0.34, ease: "power1.out" }, 2.14)
          .to(".stage-copy-2", { autoAlpha: 0, y: -24, duration: 0.18 }, 2.82);

        showCopy(3, 3.02);
        tl.to(".transformation-frame", { scale: 1, xPercent: 0, yPercent: 0, duration: 0.38 }, 2.92)
          .to(".stage-final", { autoAlpha: 1, duration: 0.38, ease: "power1.out" }, 3.08)
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
    <section className="scene-overlap relative h-[100svh] overflow-hidden bg-[#201614] text-[#fff7ef] md:h-[100dvh] lg:h-screen" ref={scope}>
      <div className="camera absolute inset-0 overflow-hidden">
        <div className="transformation-frame absolute inset-0 origin-center will-change-transform">
          <BeautyFace className="h-full w-full" aria-label="Kumulativna beauty transformacija kroz realne makeup faze" />
          <div className="final-shimmer pointer-events-none absolute inset-y-[8%] left-[-20%] w-[24%] bg-[linear-gradient(100deg,transparent,rgba(255,248,239,0.22),transparent)] opacity-0 blur-sm mix-blend-screen" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#160f0c]/76 via-[#160f0c]/8 to-[#160f0c]/26" />
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
