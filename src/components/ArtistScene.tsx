"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { artist, brand } from "@/content/site";

function imagePositionStyle(position: { desktop: string; mobile: string }) {
  return {
    "--image-position-desktop": position.desktop,
    "--image-position-mobile": position.mobile,
  } as CSSProperties;
}

export function ArtistScene() {
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
        gsap.set(".artist-photo", {
          scale: isMobile ? 1.1 : 1.22,
          width: "100vw",
          height: "100dvh",
          x: 0,
          y: 0,
          opacity: 0.86,
        });

        const entrance = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        entrance.to(".artist-photo", { scale: isMobile ? 1.06 : isTablet ? 1.12 : 1.18, opacity: 1, ease: "none" }, 0);

        if (isMobile) {
          gsap.set(".artist-copy", { opacity: 1, y: 0, filter: "none" });
          gsap.set(".artist-word-meet, .artist-word-name", { opacity: 1, xPercent: 0, filter: "none" });
          const mobileIntro = gsap.timeline({
            scrollTrigger: {
              trigger: scope.current,
              start: "top top",
              end: "+=70%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          mobileIntro
            .to(".artist-photo", { scale: 1, width: "84vw", height: "55dvh", x: "8vw", y: "10dvh" }, 0)
            .fromTo(".artist-word-meet", { opacity: 0, xPercent: -12 }, { opacity: 1, xPercent: 0 }, 0.04)
            .fromTo(".artist-word-name", { opacity: 0, xPercent: 12 }, { opacity: 1, xPercent: 0 }, 0.18);

          return () => {
            entrance.kill();
            mobileIntro.kill();
          };
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: isTablet ? "+=150%" : "+=180%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(".artist-photo", { scale: 1, width: isTablet ? "58vw" : "48vw", height: isTablet ? "68dvh" : "78vh", x: isTablet ? "20vw" : "26vw", y: isTablet ? "13dvh" : "10vh" }, 0)
          .fromTo(".artist-word-meet", { opacity: 0, xPercent: -18 }, { opacity: 1, xPercent: 0 }, 0.05)
          .fromTo(".artist-word-name", { opacity: 0, xPercent: 18 }, { opacity: 1, xPercent: 0 }, 0.28)
          .fromTo(".artist-copy", { opacity: 0, y: 55 }, { opacity: 1, y: 0 }, 0.55)
          .fromTo(".artist-meta", { opacity: 0, x: 40 }, { opacity: 1, x: 0 }, 0.68)
          .to(".artist-photo", { scale: isTablet ? 1.04 : 1.08, x: isTablet ? "18vw" : "23vw", y: isTablet ? "10dvh" : "6vh", width: isTablet ? "64vw" : "54vw", height: isTablet ? "72dvh" : "84vh" }, 1.18)
          .to(".artist-darken", { opacity: 1 }, 1.18)
          .to(".artist-word-meet, .artist-word-name, .artist-copy, .artist-meta", { opacity: 0.18, filter: "blur(3px)" }, 1.42);

        return () => {
          entrance.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section id="about" ref={scope} className="scene-overlap relative min-h-[100dvh] overflow-visible bg-[#f7efe8] text-[#241916] md:h-[100dvh] md:min-h-0 md:overflow-hidden lg:h-screen">
      <div className="artist-mobile-visual relative min-h-[86dvh] overflow-hidden md:contents">
        <div className="artist-photo absolute left-0 top-0 h-[100dvh] w-screen overflow-hidden lg:h-screen">
          <Image
            src={artist.image}
            alt={artist.alt}
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="responsive-image h-full w-full object-cover"
            style={imagePositionStyle(artist.position)}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7efe8]/0 via-[#f7efe8]/20 to-[#f7efe8]/86" />
        <div className="artist-darken pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle_at_50%_46%,rgba(244,226,198,0.14),transparent_30%),linear-gradient(180deg,rgba(27,17,16,0.12),rgba(27,17,16,0.86))] opacity-0" />
        <div className="artist-word-meet absolute left-[5vw] top-[calc(env(safe-area-inset-top)+1.5rem)] z-20 font-serif text-[clamp(3.1rem,12vw,5rem)] leading-[0.84] text-[#241916] mix-blend-multiply md:top-[9vh] md:text-[clamp(5rem,10vw,8.5rem)] lg:top-[10vh] lg:text-[clamp(5rem,12vw,12rem)] lg:leading-[0.78]">
          MEET
        </div>
        <div className="artist-word-name absolute top-[63dvh] right-[5vw] z-20 font-serif text-[clamp(3.2rem,12.5vw,5.4rem)] leading-[0.84] text-[#6f1d2a] mix-blend-multiply md:top-auto md:bottom-[10vh] md:text-[clamp(5.5rem,10vw,9rem)] lg:bottom-[8vh] lg:text-[clamp(5.8rem,12vw,13rem)] lg:leading-[0.78]">
          {artist.name}
        </div>
      </div>
      <div className="artist-mobile-copy relative z-30 block w-full px-5 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] pt-6 md:flex md:h-full md:items-end md:justify-between md:px-10 md:pb-12 md:pt-0 lg:px-12 lg:pb-16">
        <div className="artist-copy max-w-[32rem] rounded-sm bg-[#f7efe8]/92 py-4 backdrop-blur-[2px] md:mb-[5vh] md:max-w-md md:bg-transparent md:py-0 md:backdrop-blur-0 lg:mb-[8vh]">
          <p className="text-lg leading-7 text-[#3c2d27] md:mt-8 md:text-xl md:leading-8 lg:text-2xl lg:leading-10">
            {artist.intro}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6b574e] md:mt-5 md:text-base md:leading-7 lg:mt-6 lg:text-lg lg:leading-8">
            {artist.bio}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6b574e] md:mt-5 md:text-base md:leading-7 lg:mt-6 lg:text-lg lg:leading-8">
            {artist.education}
          </p>
        </div>
        <div className="artist-meta mb-[18vh] hidden max-w-48 flex-col gap-4 text-right text-xs font-bold tracking-[0.25em] text-[#8f6d5a] md:flex">
          <span>BASED IN {brand.locationDisplay}</span>
          <span>MAKEUP ARTIST</span>
        </div>
      </div>
    </section>
  );
}
