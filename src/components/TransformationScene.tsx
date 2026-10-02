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
          .set(".stage-skin, .stage-eyes, .stage-color, .stage-final", { autoAlpha: 0 })
          .set(".final-shimmer", { autoAlpha: 0 })
          .set(".reveal-skin", { scaleX: 0, transformOrigin: "0% 50%" })
          .set(".reveal-eye-left", { scaleX: 0, transformOrigin: "100% 50%" })
          .set(".reveal-eye-right", { scaleX: 0, transformOrigin: "0% 50%" })
          .set(".reveal-lips", { attr: { rx: 0, ry: 0 } })
          .set(".reveal-cheek-left, .reveal-cheek-right", { attr: { rx: 0, ry: 0 } })
          .set(".reveal-final", { scaleY: 0, transformOrigin: "50% 0%" })
          .fromTo(".transformation-enter", { opacity: 0.88 }, { opacity: 0, duration: 0.36 }, 0);

        showCopy(0, 0.08);
        tl.set(".stage-skin", { autoAlpha: 1 }, 0.18)
          .to(".reveal-skin", { scaleX: 1, duration: 0.74, ease: "power2.out" }, 0.18)
          .to(".stage-copy-0", { autoAlpha: 0, y: -24, duration: 0.18 }, 0.82);

        showCopy(1, 1.02);
        tl.to(".transformation-frame", { scale: isMobile ? 1.03 : 1.04, xPercent: isMobile ? 0 : -1, yPercent: isMobile ? -1 : 0, duration: 0.38 }, 0.92)
          .set(".stage-eyes", { autoAlpha: 1 }, 1.16)
          .to(".reveal-eye-left", { scaleX: 1, duration: 0.46, ease: "power2.out" }, 1.18)
          .to(".reveal-eye-right", { scaleX: 1, duration: 0.46, ease: "power2.out" }, 1.3)
          .to(".stage-copy-1", { autoAlpha: 0, y: -24, duration: 0.18 }, 1.82);

        showCopy(2, 2.02);
        tl.to(".transformation-frame", { scale: isMobile ? 1.02 : 1.03, xPercent: isMobile ? 0 : 1, yPercent: 0, duration: 0.38 }, 1.92)
          .set(".stage-color", { autoAlpha: 1 }, 2.14)
          .to(".reveal-cheek-left", { attr: { rx: 155, ry: 105 }, duration: 0.46, ease: "power2.out" }, 2.16)
          .to(".reveal-cheek-right", { attr: { rx: 155, ry: 105 }, duration: 0.46, ease: "power2.out" }, 2.26)
          .to(".reveal-lips", { attr: { rx: 120, ry: 58 }, duration: 0.46, ease: "power2.out" }, 2.38)
          .to(".stage-copy-2", { autoAlpha: 0, y: -24, duration: 0.18 }, 2.82);

        showCopy(3, 3.02);
        tl.to(".transformation-frame", { scale: 1, xPercent: 0, yPercent: 0, duration: 0.38 }, 2.92)
          .set(".stage-final", { autoAlpha: 1 }, 3.1)
          .to(".reveal-final", { scaleY: 1, duration: 0.48, ease: "power2.out" }, 3.12)
          .to(".final-shimmer", { autoAlpha: 0.55, xPercent: 140, duration: 0.45 }, 3.18)
          .to(".final-shimmer", { autoAlpha: 0, duration: 0.14 }, 3.62)
          .to(".look-handoff", { opacity: 1, scale: 1, duration: 0.32 }, 4.35);

        return () => tl.kill();
      },
    );

    return () => mm.revert();
  });

  return (
    <section className="scene-overlap relative h-svh overflow-hidden bg-[#201614] text-[#fff7ef] md:h-screen" ref={scope}>
      <div className="camera absolute inset-0 overflow-hidden">
        <div className="transformation-frame absolute inset-0 origin-center will-change-transform">
          <BeautyFace className="h-full w-full" aria-label="Kumulativna beauty transformacija kroz realne makeup faze" />
          <div className="final-shimmer pointer-events-none absolute inset-y-[8%] left-[-20%] w-[24%] bg-[linear-gradient(100deg,transparent,rgba(255,248,239,0.22),transparent)] opacity-0 blur-sm mix-blend-screen" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#160f0c]/76 via-[#160f0c]/8 to-[#160f0c]/26" />
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
