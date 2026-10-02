"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { artist, booking, brand } from "@/content/site";

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
            end: isMobile ? "+=150%" : "+=180%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        entrance.fromTo(
          ".artist-photo",
          { scale: 1.22, opacity: 0.86 },
          { scale: 1.18, opacity: 1, ease: "none" },
          0,
        );

        tl.fromTo(".artist-photo", { scale: 1.18, width: "100vw", height: "100svh", x: 0, y: 0 }, { scale: 1, width: isMobile ? "78vw" : "48vw", height: isMobile ? "58svh" : "78vh", x: isMobile ? "11vw" : "26vw", y: isMobile ? "12svh" : "10vh" }, 0)
          .fromTo(".artist-word-meet", { opacity: 0, xPercent: -18 }, { opacity: 1, xPercent: 0 }, 0.05)
          .fromTo(".artist-word-name", { opacity: 0, xPercent: 18 }, { opacity: 1, xPercent: 0 }, 0.28)
          .fromTo(".artist-copy", { opacity: 0, y: 55 }, { opacity: 1, y: 0 }, 0.55)
          .fromTo(".artist-meta", { opacity: 0, x: 40 }, { opacity: 1, x: 0 }, 0.68)
          .to(".artist-photo", { scale: isMobile ? 1.03 : 1.08, x: isMobile ? "8vw" : "23vw", y: isMobile ? "9svh" : "6vh", width: isMobile ? "84vw" : "54vw", height: isMobile ? "62svh" : "84vh" }, 1.18)
          .to(".artist-darken", { opacity: 1 }, 1.18)
          .fromTo(".artist-reflection-bridge", { opacity: 0, scale: 0.34, rotate: -6 }, { opacity: 1, scale: 1, rotate: 0 }, 1.34)
          .to(".artist-word-meet, .artist-word-name, .artist-copy, .artist-meta", { opacity: 0.18, filter: isMobile ? "blur(1px)" : "blur(3px)" }, 1.42);

        return () => {
          entrance.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section id="about" ref={scope} className="relative h-svh overflow-hidden bg-[#f7efe8] text-[#241916] md:h-screen">
      <div className="artist-photo absolute left-0 top-0 h-svh w-screen overflow-hidden md:h-screen">
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
      <div className="artist-reflection-bridge glass-reflection pointer-events-none absolute left-1/2 top-1/2 z-50 h-[72vh] w-[min(76vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[48%_48%_42%_42%] border border-[#d8bd80]/45 bg-[#fff7ef]/10 opacity-0 shadow-[0_40px_160px_rgba(0,0,0,0.32)] backdrop-blur-[2px]">
        <Image
          src={booking.reflection}
          alt="Reflection forming into final mirror"
          fill
          sizes="520px"
          className="responsive-image object-cover opacity-60"
          style={imagePositionStyle(booking.position)}
        />
        <div className="absolute inset-0 bg-[#fff7ef]/18 mix-blend-screen" />
      </div>
      <div className="artist-word-meet absolute left-[5vw] top-[8svh] z-20 font-serif text-[clamp(4.6rem,20vw,15rem)] leading-[0.72] text-[#241916] mix-blend-multiply md:top-[10vh]">
        MEET
      </div>
      <div className="artist-word-name absolute bottom-[13svh] right-[5vw] z-20 font-serif text-[clamp(5.2rem,22vw,16rem)] leading-[0.72] text-[#6f1d2a] mix-blend-multiply md:bottom-[8vh]">
        {artist.name}
      </div>
      <div className="relative z-30 flex h-full w-full items-end justify-between px-5 pb-10 md:px-12 md:pb-16">
        <div className="artist-copy mb-[3svh] max-w-[18rem] md:mb-[8vh] md:max-w-md">
          <p className="mt-8 text-2xl leading-10 text-[#3c2d27]">
            {artist.intro}
          </p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6b574e]">
            {artist.bio}
          </p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6b574e]">
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
