"use client";

import { useRef } from "react";
import Image from "next/image";
import { BeautyFace } from "@/components/BeautyFace";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { primaryServiceImage } from "@/content/site";

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
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
      },
      (context) => {
        const isMobile = context.conditions?.mobile;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: isMobile ? "+=260%" : "+=360%",
            scrub: 1.15,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        const showCopy = (index: number, at: number) => {
          tl.to(".stage-copy", { autoAlpha: 0, y: -22, duration: 0.16 }, at - 0.02)
            .fromTo(`.stage-copy-${index}`, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.24 }, at);
        };

        tl.set(".stage-copy", { autoAlpha: 0, y: 20 })
          .set(".makeup-layer", { autoAlpha: 0 })
          .set(".makeup-application", { autoAlpha: 0 })
          .set(".reveal-skin", { scaleX: 0, transformOrigin: "0% 50%" })
          .set(".reveal-eye-left", { scaleX: 0, transformOrigin: "100% 50%" })
          .set(".reveal-eye-right", { scaleX: 0, transformOrigin: "0% 50%" })
          .set(".reveal-lips", { scaleX: 0, transformOrigin: "50% 50%" })
          .set(".reveal-cheek-left, .reveal-cheek-right", { attr: { rx: 0, ry: 0 } })
          .set(".reveal-final", { scaleY: 0, transformOrigin: "50% 0%" })
          .fromTo(".transformation-enter", { opacity: 0.88 }, { opacity: 0, duration: 0.36 }, 0);

        showCopy(0, 0.08);
        tl.fromTo(".skin-application", { autoAlpha: 0, xPercent: -35, scaleX: 0.45 }, { autoAlpha: 0.72, xPercent: 18, scaleX: 1, duration: 0.34 }, 0.16)
          .set(".makeup-skin", { autoAlpha: 1 }, 0.18)
          .to(".reveal-skin", { scaleX: 1, duration: 0.58, ease: "power2.out" }, 0.18)
          .to(".skin-application", { autoAlpha: 0, duration: 0.18 }, 0.68)
          .to(".stage-copy-0", { autoAlpha: 0, y: -24, duration: 0.18 }, 0.82);

        showCopy(1, 1.02);
        tl.to(".portrait-stage", { scale: isMobile ? 1.03 : 1.05, xPercent: isMobile ? 0 : 3, yPercent: isMobile ? -1 : -1, duration: 0.38 }, 0.92)
          .fromTo(".eye-application", { autoAlpha: 0, scaleX: 0, xPercent: -12 }, { autoAlpha: 0.78, scaleX: 1, xPercent: 4, duration: 0.32 }, 1.14)
          .set(".makeup-eyes", { autoAlpha: 1 }, 1.16)
          .to(".reveal-eye-left", { scaleX: 1, duration: 0.34, ease: "power2.out" }, 1.18)
          .to(".reveal-eye-right", { scaleX: 1, duration: 0.34, ease: "power2.out" }, 1.28)
          .to(".eye-application", { autoAlpha: 0, duration: 0.18 }, 1.62)
          .to(".stage-copy-1", { autoAlpha: 0, y: -24, duration: 0.18 }, 1.82);

        showCopy(2, 2.02);
        tl.to(".portrait-stage", { scale: isMobile ? 1.02 : 1.04, xPercent: isMobile ? 0 : 2, yPercent: 0, duration: 0.38 }, 1.92)
          .fromTo(".color-application", { autoAlpha: 0, scale: 0.55 }, { autoAlpha: 0.62, scale: 1.12, duration: 0.34 }, 2.12)
          .set(".makeup-color", { autoAlpha: 1 }, 2.14)
          .to(".reveal-cheek-left", { attr: { rx: 120, ry: 86 }, duration: 0.32, ease: "power2.out" }, 2.16)
          .to(".reveal-cheek-right", { attr: { rx: 120, ry: 86 }, duration: 0.32, ease: "power2.out" }, 2.24)
          .to(".reveal-lips", { scaleX: 1, duration: 0.36, ease: "power2.out" }, 2.34)
          .to(".color-application", { autoAlpha: 0, duration: 0.2 }, 2.68)
          .to(".stage-copy-2", { autoAlpha: 0, y: -24, duration: 0.18 }, 2.82);

        showCopy(3, 3.02);
        tl.to(".portrait-stage", { scale: 1, xPercent: 0, yPercent: 0, duration: 0.38 }, 2.92)
          .set(".makeup-final", { autoAlpha: 1 }, 3.1)
          .to(".reveal-final", { scaleY: 1, duration: 0.48, ease: "power2.out" }, 3.12)
          .to(".final-shimmer", { autoAlpha: 0.55, xPercent: 140, duration: 0.45 }, 3.18)
          .to(".final-shimmer", { autoAlpha: 0, duration: 0.14 }, 3.62)
          .to(".look-handoff", { opacity: 1, scale: 1, duration: 0.32 }, 3.58);

        return () => tl.kill();
      },
    );

    return () => mm.revert();
  });

  return (
    <section className="scene-overlap relative h-svh overflow-hidden bg-[#201614] text-[#fff7ef] md:h-screen" ref={scope}>
      <div className="camera absolute inset-0 flex items-center justify-center px-4 py-[7svh] md:px-10 md:py-[6vh]">
        <div className="portrait-stage relative z-10 aspect-[2/3] h-[min(82svh,820px)] max-h-[820px] w-auto max-w-[min(76vw,560px)] origin-center overflow-visible will-change-transform md:h-[min(86vh,860px)] md:max-w-[min(44vw,620px)]">
          <BeautyFace className="h-full w-full" aria-label="Kumulativna beauty transformacija kroz slojeve šminke" />
          <div className="makeup-application skin-application pointer-events-none absolute left-[18%] top-[18%] h-[52%] w-[66%] rounded-[48%] bg-[linear-gradient(105deg,transparent,rgba(255,247,239,0.58),rgba(244,198,176,0.28),transparent)] opacity-0 blur-xl mix-blend-screen" />
          <div className="makeup-application eye-application pointer-events-none absolute left-[30%] top-[32%] h-[10%] w-[42%] origin-left rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,247,239,0.72),rgba(111,29,42,0.28),transparent)] opacity-0 blur-md mix-blend-screen" />
          <div className="makeup-application color-application pointer-events-none absolute left-[30%] top-[42%] h-[25%] w-[42%] rounded-full bg-[radial-gradient(circle_at_50%_70%,rgba(111,29,42,0.34),rgba(244,198,176,0.24),transparent_70%)] opacity-0 blur-lg mix-blend-soft-light" />
          <div className="makeup-application final-shimmer pointer-events-none absolute inset-y-[12%] left-[-38%] w-[32%] bg-[linear-gradient(100deg,transparent,rgba(255,248,239,0.4),transparent)] opacity-0 blur-sm mix-blend-screen" />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#160f0c]/72 via-[#160f0c]/12 to-[#160f0c]/24" />
      </div>

      <div className="transformation-enter pointer-events-none absolute inset-0 z-20 bg-[#fff7ef]/18 backdrop-blur-[8px]" />
      <div className="look-handoff pointer-events-none absolute right-[-20vw] top-[22vh] z-20 h-[56vh] w-[58vw] scale-110 overflow-hidden opacity-0 md:right-[-8vw] md:top-[12vh] md:h-[76vh] md:w-[42vw]">
        <Image
          src={primaryServiceImage}
          alt="Profesionalno šminkanje"
          fill
          sizes="42vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-30 flex h-full items-end px-5 pb-8 md:px-12 md:pb-20">
        <div className="relative min-h-52 w-full max-w-4xl md:min-h-64">
          {makeupStages.map((stage, index) => (
            <div
              className={`stage-copy stage-copy-${index} absolute bottom-0 left-0 max-w-3xl opacity-0`}
              key={stage.title}
            >
              <p className="text-sm font-bold tracking-[0.42em] text-[#d2af76]">{stage.number}</p>
              <h2 className="mt-2 font-serif text-[clamp(3.6rem,18vw,12rem)] leading-[0.78]">
                {stage.title}
              </h2>
              <p className="mt-4 max-w-[18rem] text-base leading-7 text-[#f4dfd2] md:mt-5 md:max-w-md md:text-xl md:leading-8">{stage.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
