"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { makeupProps, transformation } from "@/content/site";
import { MOBILE_SCRUB, viewportScrollDistance } from "@/lib/scrollCadence";

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
            scale: 1,
            xPercent: isMobile ? 0 : 0,
            yPercent: isMobile ? 0 : 0,
          },
          eyes: {
            scale: isMobile ? 1.025 : isTablet ? 1.03 : 1.035,
            xPercent: isMobile ? -0.8 : isTablet ? -1.1 : -1.4,
            yPercent: isMobile ? 1.2 : isTablet ? 1.4 : 1.6,
          },
          color: {
            scale: isMobile ? 1.03 : isTablet ? 1.035 : 1.04,
            xPercent: isMobile ? -0.4 : isTablet ? -0.7 : -1,
            yPercent: isMobile ? -1.4 : isTablet ? -1.7 : -2,
          },
          final: {
            scale: isMobile ? 1.005 : isTablet ? 1.01 : 1.012,
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
            end: isMobile ? viewportScrollDistance(3.8) : isTablet ? viewportScrollDistance(3.2, 0.9) : "+=360%",
            scrub: isMobile ? MOBILE_SCRUB : 1.15,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        entrance
          .fromTo(".transformation-frame", { opacity: 0.72 }, { opacity: 1, ease: "none" }, 0)
          .fromTo(".transformation-stage-image-0", { autoAlpha: 0, scale: 1.035 }, { autoAlpha: 1, scale: 1, ease: "none" }, 0)
          .fromTo(".transformation-enter", { opacity: 0.68 }, { opacity: 0.18, ease: "none" }, 0);

        const showCopy = (index: number, at: number) => {
          tl.to(".stage-copy", { autoAlpha: 0, y: -22, duration: 0.16 }, at - 0.02)
            .fromTo(`.stage-copy-${index}`, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.24 }, at);
        };

        tl.set(".stage-copy", { autoAlpha: 0, y: 20 })
          .set(".final-shimmer", { autoAlpha: 0 })
          .set(".transformation-photo", camera.ten)
          .set(".transformation-stage-image", { autoAlpha: 0 })
          .set(".transformation-stage-image-0", { autoAlpha: 1 })
          .set(".transformation-prop", { autoAlpha: 1 })
          .fromTo(".transformation-enter", { opacity: 0.18 }, { opacity: 0, duration: 0.34 }, 0);

        showCopy(0, 0.08);
        tl.to(".stage-copy-0", { autoAlpha: 0, y: -24, duration: 0.18 }, 0.86);

        showCopy(1, 1.02);
        tl.to(".transformation-photo", { ...camera.eyes, duration: 0.58, ease: "power1.inOut" }, 0.92)
          .to(".transformation-stage-image-1", { autoAlpha: 1, duration: 0.38, ease: "power1.inOut" }, 0.98)
          .to(".transformation-stage-image-0", { autoAlpha: 0, duration: 0.3, ease: "power1.inOut" }, 1.1)
          .to(".stage-copy-1", { autoAlpha: 0, y: -24, duration: 0.18 }, 1.82);

        showCopy(2, 2.02);
        tl.to(".transformation-photo", { ...camera.color, duration: 0.58, ease: "power1.inOut" }, 1.92)
          .to(".transformation-stage-image-2", { autoAlpha: 1, duration: 0.38, ease: "power1.inOut" }, 1.98)
          .to(".transformation-stage-image-1", { autoAlpha: 0, duration: 0.3, ease: "power1.inOut" }, 2.1)
          .to(".stage-copy-2", { autoAlpha: 0, y: -24, duration: 0.18 }, 2.82);

        showCopy(3, 3.02);
        tl.to(".transformation-photo", { ...camera.final, duration: 0.58, ease: "power1.inOut" }, 2.92)
          .to(".transformation-stage-image-3", { autoAlpha: 1, duration: 0.38, ease: "power1.inOut" }, 2.98)
          .to(".transformation-stage-image-2", { autoAlpha: 0, duration: 0.3, ease: "power1.inOut" }, 3.1)
          .to(".final-shimmer", { autoAlpha: 0.55, xPercent: 140, duration: 0.45 }, 3.18)
          .to(".final-shimmer", { autoAlpha: 0, duration: 0.14 }, 3.62);

        tl.to(".transformation-brush", { x: isMobile ? 12 : isTablet ? 28 : 54, y: isMobile ? -8 : isTablet ? -14 : -24, rotate: isMobile ? -18 : -16, duration: 3.4, ease: "none" }, 0)
          .to(".transformation-palette", { x: isMobile ? -6 : isTablet ? -14 : -28, y: isMobile ? 8 : isTablet ? 16 : 32, rotate: isMobile ? 8 : 10, duration: 3.4, ease: "none" }, 0)
          .to(".transformation-lipstick", { x: isMobile ? -8 : isTablet ? -14 : -26, y: isMobile ? -12 : isTablet ? -28 : -48, rotate: isMobile ? 9 : 13, duration: 3.4, ease: "none" }, 0)
          .to(".transformation-mascara", { x: isMobile ? 0 : isTablet ? 18 : 38, y: isMobile ? 0 : isTablet ? -10 : -22, rotate: isMobile ? 0 : -27, duration: 3.4, ease: "none" }, 0);

        return () => {
          entrance.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section className="scene-overlap relative h-[var(--scene-vh)] overflow-hidden bg-[#201614] text-[#fff7ef] lg:h-screen" ref={scope}>
      <div className="camera absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_76%_34%,rgba(111,29,42,0.24),transparent_30%),linear-gradient(120deg,#160f0c_0%,#241613_46%,#17100e_100%)]">
        <div className="pointer-events-none absolute left-5 top-[calc(env(safe-area-inset-top)+1.35rem)] z-10 text-[10px] font-bold tracking-[0.38em] text-[#d8bd80]/55 md:left-10 md:top-[8vh] lg:left-12">
          YUUMI ART / MAKEUP STUDY / 01—04
        </div>
        <Image
          src={makeupProps.brush}
          alt=""
          aria-hidden="true"
          width={220}
          height={520}
          className="transformation-prop transformation-brush pointer-events-none absolute -bottom-[8dvh] -left-[12vw] z-10 hidden h-[34dvh] w-auto rotate-[-24deg] opacity-45 md:block md:h-[39dvh] lg:-bottom-[10vh] lg:-left-[4vw] lg:h-[46vh]"
        />
        <Image
          src={makeupProps.eyeshadowPalette}
          alt=""
          aria-hidden="true"
          width={360}
          height={220}
          className="transformation-prop transformation-palette pointer-events-none absolute left-[13vw] top-[calc(var(--scene-vh)*0.16)] z-10 h-[calc(var(--scene-vh)*0.09)] w-auto rotate-[10deg] opacity-35 md:left-[8vw] md:top-[18dvh] md:h-[12dvh] lg:left-[18vw] lg:top-[12vh] lg:h-[13vh]"
        />
        <Image
          src={makeupProps.lipstick}
          alt=""
          aria-hidden="true"
          width={180}
          height={360}
          className="transformation-prop transformation-lipstick pointer-events-none absolute -right-[5vw] bottom-[calc(var(--scene-vh)*0.1)] z-10 h-[calc(var(--scene-vh)*0.2)] w-auto rotate-[18deg] opacity-55 md:-right-[3vw] md:bottom-[11dvh] md:h-[24dvh] lg:right-[2vw] lg:bottom-[7vh] lg:h-[28vh]"
        />
        <Image
          src={makeupProps.mascara}
          alt=""
          aria-hidden="true"
          width={120}
          height={520}
          className="transformation-prop transformation-mascara pointer-events-none absolute right-[26vw] top-[9dvh] z-10 hidden h-[27dvh] w-auto rotate-[-34deg] opacity-30 md:block lg:right-[35vw] lg:top-[7vh] lg:h-[32vh]"
        />
        <div className="transformation-frame absolute left-1/2 top-[calc(var(--scene-vh)*0.07)] z-20 h-[calc(var(--scene-vh)*0.72)] w-[92vw] -translate-x-1/2 overflow-hidden shadow-[0_36px_130px_rgba(0,0,0,0.42)] md:left-auto md:right-[4vw] md:top-[11dvh] md:h-[78dvh] md:w-[82vw] md:translate-x-0 lg:right-[5vw] lg:top-[8vh] lg:h-[84vh] lg:w-[68vw]">
          <div className="transformation-photo absolute inset-0 will-change-transform">
            {transformation.stages.map((stage, index) => (
              <Image
                src={stage.src}
                alt={stage.alt}
                fill
                priority={index === 0}
                quality={92}
                sizes="(max-width: 767px) 92vw, (max-width: 1023px) 82vw, 68vw"
                className={`responsive-image transformation-stage-image transformation-stage-image-${index} h-full w-full object-cover ${index === 0 ? "opacity-100" : "opacity-0"}`}
                key={stage.src}
                style={imagePositionStyle(stage.position)}
              />
            ))}
          </div>
          <div className="final-shimmer pointer-events-none absolute inset-y-0 left-[-22%] w-[18%] bg-[linear-gradient(100deg,transparent,rgba(255,248,239,0.16),transparent)] opacity-0 mix-blend-screen" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[calc(var(--scene-vh)*0.42)] bg-gradient-to-t from-[#160f0c]/78 via-[#160f0c]/24 to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-0 z-30 hidden bg-gradient-to-r from-[#160f0c]/86 via-[#160f0c]/20 to-[#160f0c]/12 md:block" />
      </div>

      <div className="transformation-enter pointer-events-none absolute inset-0 z-20 bg-[#201614]/45" />
      <div className="relative z-30 flex h-full items-end px-5 pb-[calc(env(safe-area-inset-bottom)+1.75rem)] md:px-10 md:pb-14 lg:px-12 lg:pb-20">
        <div className="relative min-h-44 w-full max-w-[88vw] sm:min-h-52 md:max-w-2xl lg:min-h-64 lg:max-w-4xl">
          {makeupStages.map((stage, index) => (
            <div className={`stage-copy stage-copy-${index} absolute bottom-0 left-0 max-w-[min(88vw,44rem)] opacity-0 drop-shadow-[0_12px_28px_rgba(22,15,12,0.44)]`} key={stage.title}>
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
