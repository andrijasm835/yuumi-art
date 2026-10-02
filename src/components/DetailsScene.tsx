"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { artist, detailImages } from "@/content/site";

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
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
      },
      (context) => {
        const isMobile = context.conditions?.mobile;
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
            end: isMobile ? "+=260%" : "+=320%",
            scrub: 1.15,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        entrance
          .fromTo(".details-entry", { opacity: 0.82 }, { opacity: 1, ease: "none" }, 0)
          .fromTo(".detail-a", { yPercent: isMobile ? 24 : 38 }, { yPercent: isMobile ? 16 : 28, ease: "none" }, 0)
          .fromTo(".details-word-one", { yPercent: isMobile ? 7 : 12 }, { yPercent: 0, ease: "none" }, 0);

        tl.fromTo(".detail-a", { xPercent: isMobile ? -38 : -72, yPercent: isMobile ? 16 : 28, clipPath: "inset(0 100% 0 0)" }, { xPercent: 0, yPercent: 0, clipPath: "inset(0 0% 0 0)" }, 0)
          .to(".details-word-one", { xPercent: isMobile ? -8 : -28, yPercent: isMobile ? -6 : -12 }, 0)
          .fromTo(".detail-b", { xPercent: isMobile ? 30 : 58, yPercent: isMobile ? -12 : -26, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }, { xPercent: 0, yPercent: 0, clipPath: "polygon(0 0, 100% 0, 88% 100%, 8% 100%)" }, 0.9)
          .to(".details-word-two", { xPercent: isMobile ? 6 : 22, yPercent: isMobile ? 8 : 16, opacity: 0.5 }, 0.85)
          .fromTo(".detail-c", { yPercent: isMobile ? 38 : 72, scale: 0.9, clipPath: "circle(0% at 50% 50%)" }, { yPercent: 0, scale: 1, clipPath: "circle(78% at 50% 50%)" }, 1.72)
          .to(".details-word-three", { xPercent: isMobile ? -3 : -8, yPercent: isMobile ? -16 : -34, opacity: 0.42 }, 1.7)
          .to(".detail-front", { opacity: 1, yPercent: -8 }, 1.95)
          .to(".detail-img", { filter: isMobile ? "contrast(1.02)" : "contrast(1.04) saturate(1.03)", scale: isMobile ? 1.02 : 1.05 }, 2.05)
          .to(".detail-c", { scale: isMobile ? 1.04 : 1.12, xPercent: isMobile ? -1 : -3, yPercent: isMobile ? -2 : -6 }, 2.45)
          .to(".details-light", { opacity: 1 }, 2.55)
          .to(".artist-bridge", { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }, 2.72);

        return () => {
          entrance.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section ref={scope} className="relative h-svh overflow-hidden bg-[#211714] text-[#fff7ef] md:h-screen">
      <div className="details-entry absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(118,29,42,0.32),transparent_34%),radial-gradient(circle_at_22%_72%,rgba(199,168,107,0.24),transparent_30%)]" />
      <div className="absolute inset-0 z-10 font-serif text-[clamp(4.2rem,18vw,14rem)] leading-[0.75] tracking-normal text-[#fff7ef]/34">
        <span className="details-word-one absolute left-[6vw] top-[15vh]">BEAUTY</span>
        <span className="details-word-two absolute right-[8vw] top-[38vh]">IS IN</span>
        <span className="details-word-three absolute bottom-[10vh] left-[18vw]">THE DETAILS.</span>
      </div>
      <div className="absolute inset-0 z-20">
        <div className="detail-a absolute left-[5vw] top-[13vh] h-[32vh] w-[70vw] overflow-hidden md:top-[12vh] md:h-[38vh] md:w-[42vw] md:min-w-64">
          <Image src={details[0].src} alt={details[0].alt} fill sizes="34vw" className="responsive-image detail-img h-full w-full object-cover" style={imagePositionStyle(details[0].position)} />
        </div>
        <div className="detail-b absolute right-[5vw] top-[30vh] h-[40vh] w-[48vw] overflow-hidden md:right-[7vw] md:top-[5vh] md:h-[64vh] md:w-[28vw] md:min-w-64">
          <Image src={details[1].src} alt={details[1].alt} fill sizes="30vw" className="responsive-image detail-img h-full w-full object-cover" style={imagePositionStyle(details[1].position)} />
        </div>
        <div className="detail-c absolute bottom-[8vh] left-[13vw] h-[36vh] w-[74vw] overflow-hidden md:bottom-[7vh] md:left-[31vw] md:h-[42vh] md:w-[34vw] md:min-w-72">
          <Image src={details[2].src} alt={details[2].alt} fill sizes="30vw" className="responsive-image detail-img h-full w-full object-cover" style={imagePositionStyle(details[2].position)} />
        </div>
      </div>
      <div className="detail-front pointer-events-none absolute left-[10vw] top-[34vh] z-30 max-w-[80vw] opacity-0 font-serif text-[clamp(4rem,13vw,12rem)] leading-[0.78] text-[#fff7ef] mix-blend-difference">
        DETAILS.
      </div>
      <div className="details-light pointer-events-none absolute inset-0 z-40 bg-[#f7efe8]/72 opacity-0" />
      <div className="artist-bridge pointer-events-none absolute inset-0 z-50 opacity-0 [clip-path:inset(100%_0%_0%_0%)]">
        <Image
          src={artist.image}
          alt="Artist portrait transition"
          fill
          sizes="100vw"
          className="responsive-image object-cover"
          style={imagePositionStyle(artist.position)}
        />
        <div className="absolute inset-0 bg-[#f7efe8]/24" />
      </div>
    </section>
  );
}
