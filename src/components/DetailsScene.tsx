"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { detailImages } from "@/content/site";
import { MOBILE_SCRUB, viewportScrollDistance } from "@/lib/scrollCadence";

const details = [detailImages.lips, detailImages.eye, detailImages.texture];

function imagePositionStyle(position: { desktop: string; mobile: string }) {
  return {
    "--image-position-desktop": position.desktop,
    "--image-position-mobile": position.mobile,
  } as CSSProperties;
}

export function DetailsScene() {
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
        gsap.set(".detail-a", {
          xPercent: isMobile ? -24 : isTablet ? -44 : -72,
          yPercent: isMobile ? 14 : isTablet ? 24 : 38,
          clipPath: "inset(0 100% 0 0)",
        });
        gsap.set(".details-word-one", { yPercent: isMobile ? 3 : isTablet ? 7 : 12 });
        gsap.set(".details-word-two", { xPercent: isMobile ? 0 : isTablet ? 4 : 8, yPercent: isMobile ? 3 : isTablet ? 6 : 10, opacity: 0.24 });
        gsap.set(".details-word-three", { xPercent: isMobile ? 0 : isTablet ? -2 : -5, yPercent: isMobile ? 4 : isTablet ? 8 : 16, opacity: 0.22 });
        gsap.set(".detail-front", { opacity: 0, yPercent: 0 });

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
            end: isMobile ? viewportScrollDistance(2.8) : isTablet ? viewportScrollDistance(3.1, 0.9) : "+=320%",
            scrub: isMobile ? MOBILE_SCRUB : 1.15,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        entrance
          .fromTo(".details-entry", { opacity: 0.82 }, { opacity: 1, ease: "none" }, 0)
          .to(".detail-a", {
            xPercent: isMobile ? -10 : isTablet ? -24 : -44,
            yPercent: isMobile ? 8 : isTablet ? 16 : 28,
            clipPath: "inset(0 58% 0 0)",
            ease: "none",
          }, 0)
          .to(".details-word-one", { yPercent: 0, ease: "none" }, 0);

        tl.to(".detail-a", { xPercent: 0, yPercent: 0, clipPath: "inset(0 0% 0 0)" }, 0)
          .to(".details-word-one", { xPercent: isMobile ? -2 : isTablet ? -12 : -28, yPercent: isMobile ? -2 : isTablet ? -6 : -12 }, 0)
          .fromTo(".detail-b", { xPercent: isMobile ? 12 : isTablet ? 34 : 58, yPercent: isMobile ? -6 : isTablet ? -14 : -26, clipPath: isMobile ? "inset(0 0 100% 0)" : "polygon(0 0, 100% 0, 100% 0, 0 0)" }, { xPercent: 0, yPercent: 0, clipPath: isMobile ? "inset(0 0 0% 0)" : "polygon(0 0, 100% 0, 88% 100%, 8% 100%)" }, 0.9)
          .to(".details-word-two", { xPercent: isMobile ? 2 : isTablet ? 10 : 22, yPercent: isMobile ? 3 : isTablet ? 8 : 16, opacity: 0.42 }, 0.85)
          .fromTo(".detail-c", { yPercent: isMobile ? 20 : isTablet ? 42 : 72, scale: 0.94, clipPath: isMobile ? "inset(100% 0 0 0)" : "circle(0% at 50% 50%)" }, { yPercent: 0, scale: 1, clipPath: isMobile ? "inset(0% 0 0 0)" : "circle(78% at 50% 50%)" }, 1.72)
          .to(".details-word-three", { xPercent: isMobile ? 0 : isTablet ? -3 : -8, yPercent: isMobile ? -8 : isTablet ? -18 : -34, opacity: 0.36 }, 1.7)
          .to(".detail-front", { opacity: 1, yPercent: isMobile ? -2 : -8 }, 1.95)
          .to(".detail-img", { filter: isMobile ? "none" : "contrast(1.04) saturate(1.03)", scale: isMobile ? 1.01 : isTablet ? 1.025 : 1.05 }, 2.05)
          .to(".detail-c", { scale: isMobile ? 1.015 : isTablet ? 1.06 : 1.12, xPercent: isMobile ? 0 : isTablet ? -1 : -3, yPercent: isMobile ? -1 : isTablet ? -3 : -6 }, 2.45)
          .to(".details-light", { opacity: 1 }, 2.55);

        return () => {
          entrance.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section ref={scope} className="relative h-[var(--scene-vh)] overflow-hidden bg-[#211714] text-[#fff7ef] lg:h-screen">
      <div className="details-entry absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(118,29,42,0.32),transparent_34%),radial-gradient(circle_at_22%_72%,rgba(199,168,107,0.24),transparent_30%)]" />
      <div className="absolute inset-0 z-10 font-serif text-[clamp(3rem,12vw,6rem)] leading-[0.82] tracking-normal text-[#fff7ef]/24 md:text-[clamp(4.6rem,10vw,8rem)] lg:text-[clamp(3.8rem,16vw,12rem)] lg:leading-[0.78]">
        <span className="details-word-one absolute left-[6vw] top-[11svh] lg:top-[15vh]">BEAUTY</span>
        <span className="details-word-two absolute right-[7vw] top-[35svh] lg:right-[8vw] lg:top-[38vh]">IS IN</span>
        <span className="details-word-three absolute bottom-[12svh] left-[8vw] max-w-[86vw] lg:bottom-[10vh] lg:left-[18vw]">THE DETAILS.</span>
      </div>
      <div className="absolute inset-0 z-20">
        <div className="detail-a absolute left-[4vw] top-[calc(var(--scene-vh)*0.15)] h-[calc(var(--scene-vh)*0.29)] w-[68vw] overflow-hidden md:left-[5vw] md:top-[14svh] md:h-[34svh] md:w-[54vw] lg:top-[12vh] lg:h-[38vh] lg:w-[42vw] lg:min-w-64">
          <Image src={details[0].src} alt={details[0].alt} fill sizes="34vw" className="responsive-image detail-img h-full w-full object-cover" style={imagePositionStyle(details[0].position)} />
        </div>
        <div className="detail-b absolute right-[4vw] top-[calc(var(--scene-vh)*0.31)] h-[calc(var(--scene-vh)*0.38)] w-[48vw] overflow-hidden md:right-[7vw] md:top-[10svh] md:h-[52svh] md:w-[34vw] lg:top-[5vh] lg:h-[64vh] lg:w-[28vw] lg:min-w-64">
          <Image src={details[1].src} alt={details[1].alt} fill sizes="30vw" className="responsive-image detail-img h-full w-full object-cover" style={imagePositionStyle(details[1].position)} />
        </div>
        <div className="detail-c absolute bottom-[calc(var(--scene-vh)*0.07)] left-[15vw] h-[calc(var(--scene-vh)*0.32)] w-[72vw] overflow-hidden md:bottom-[8svh] md:left-[26vw] md:h-[34svh] md:w-[42vw] lg:bottom-[7vh] lg:left-[31vw] lg:h-[42vh] lg:w-[34vw] lg:min-w-72">
          <Image src={details[2].src} alt={details[2].alt} fill sizes="30vw" className="responsive-image detail-img h-full w-full object-cover" style={imagePositionStyle(details[2].position)} />
        </div>
      </div>
      <div className="detail-front pointer-events-none absolute left-[8vw] top-[49svh] z-30 max-w-[84vw] opacity-0 font-serif text-[clamp(2.8rem,12vw,4.6rem)] leading-[0.86] text-[#fff7ef] mix-blend-difference md:left-[10vw] md:top-[38svh] md:text-[clamp(4rem,9vw,7rem)] lg:top-[34vh] lg:text-[clamp(3.5rem,11vw,9rem)] lg:leading-[0.82]">
        DETAILS.
      </div>
      <div className="details-light pointer-events-none absolute inset-0 z-40 bg-[#f7efe8]/72 opacity-0" />
    </section>
  );
}
