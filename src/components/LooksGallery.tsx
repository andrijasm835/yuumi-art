"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { servicesAndEducation } from "@/content/site";

function imagePositionStyle(position: { desktop: string; mobile: string }) {
  return {
    "--image-position-desktop": position.desktop,
    "--image-position-mobile": position.mobile,
  } as CSSProperties;
}

const serviceTextLayouts = {
  "bottom-left":
    "left-5 bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] max-w-[82%] md:left-8 md:bottom-8 md:max-w-[68%] lg:left-[5vw] lg:bottom-[6vh] lg:max-w-[72%]",
  "top-right":
    "left-5 top-[calc(env(safe-area-inset-top)+4.6rem)] max-w-[82%] md:left-auto md:right-8 md:top-20 md:max-w-[62%] lg:right-[5vw] lg:top-[8vh] lg:max-w-[66%]",
} as const;

function serviceTextLayout(layout: string) {
  return serviceTextLayouts[layout as keyof typeof serviceTextLayouts] ?? serviceTextLayouts["bottom-left"];
}

export function LooksGallery() {
  const scope = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [preview, setPreview] = useState<(typeof servicesAndEducation)[number] | null>(null);

  useEffect(() => {
    if (!preview) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus();
    };
  }, [preview]);

  useGsapScene(scope, () => {
    const track = scope.current?.querySelector<HTMLElement>(".looks-track");
    if (!track) return;

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
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: isMobile ? "+=245%" : isTablet ? "+=290%" : "+=340%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        entrance.fromTo(
          track,
          { yPercent: isMobile ? 5 : isTablet ? 7 : 10, scale: isMobile ? 1.008 : isTablet ? 1.015 : 1.025, opacity: 0.82 },
          { yPercent: 0, scale: 1, opacity: 1, ease: "none" },
          0,
        );

        timeline
          .to(track, { x: () => -distance(), ease: "none", duration: 3 }, 0)
          .to(".look-image:not(.no-service-zoom)", { scale: isMobile ? 1.01 : isTablet ? 1.025 : 1.055, xPercent: isMobile ? -0.25 : isTablet ? -0.75 : -1.5, stagger: 0.06, duration: 3 }, 0)
          .to(scope.current, { backgroundColor: "#211714", ease: "none", duration: 0.78 }, 2.36)
          .to(".service-final-image", { scale: isMobile ? 1.018 : isTablet ? 1.04 : 1.09, xPercent: isMobile ? -0.25 : isTablet ? -0.75 : -1.5, yPercent: isMobile ? 0.25 : isTablet ? 0.5 : 1, filter: isMobile ? "contrast(1.01)" : "contrast(1.03) saturate(1.03)", duration: 0.82 }, 2.38);

        return () => {
          entrance.kill();
          timeline.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section id="work" ref={scope} className="relative h-[100svh] overflow-hidden bg-[#f5eadf] text-[#241916] md:h-[100dvh] lg:h-screen">
      <div className="absolute left-5 top-[calc(env(safe-area-inset-top)+1.5rem)] z-20 text-xs font-bold tracking-[0.32em] text-[#7f665a] md:left-8 lg:left-12">
        USLUGE & EDUKACIJE
      </div>
      <div className="looks-track flex h-full w-max items-center gap-[4vw] px-[7vw] will-change-transform md:gap-[2vw] md:px-[5vw] lg:w-[390vw] lg:gap-[1vw] lg:px-[7vw]">
        {servicesAndEducation.map((look, index) => (
          <button
            key={look.name}
            data-cursor="VIEW"
            onClick={() => setPreview(look)}
            className={`service-item group relative shrink-0 overflow-visible text-left outline-none ${look.frame}`}
          >
            <div className="relative h-full w-full overflow-hidden bg-[#211714]/10">
              <Image
                src={look.image}
                alt={look.imageAlt}
                fill
                sizes="(max-width: 767px) 88vw, (max-width: 1023px) 82vw, 86vw"
                className={`responsive-image look-image h-full w-full ${
                  look.fit === "contain" ? "object-contain" : "object-cover"
                } ${
                  index === servicesAndEducation.length - 1 ? "service-final-image" : ""
                } ${look.fit === "contain" ? "no-service-zoom" : ""}`}
                style={imagePositionStyle(look.position)}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,15,12,0.44)_0%,transparent_34%,transparent_54%,rgba(22,15,12,0.68)_100%)]" />
            </div>
            <div
              className={`look-title pointer-events-none absolute z-20 text-[#fff8ef] ${serviceTextLayout(look.layout)}`}
              style={{ textShadow: "0 2px 18px rgba(22,15,12,0.3)" }}
            >
              <p className="text-xs font-bold tracking-[0.4em] text-[#d9b577]">
                {String(index + 1).padStart(2, "0")} / 04
              </p>
              <h2 className="mt-3 font-serif text-[clamp(2rem,9.8vw,3.85rem)] leading-[0.94] md:text-[clamp(2.6rem,6vw,5.2rem)] lg:text-[clamp(2.8rem,7vw,7.5rem)]">
                {look.nameLines.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-3 max-w-[17rem] text-sm font-medium leading-6 text-current md:mt-4 md:max-w-[24rem] md:text-[1rem] lg:mt-5 lg:max-w-[30rem] lg:text-[1.05rem]">{look.text}</p>
            </div>
          </button>
        ))}
      </div>

      {preview ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[95] grid animate-[previewIn_220ms_ease-out] place-items-center bg-[#160f0c]/88 p-[calc(env(safe-area-inset-top)+1rem)_1rem_calc(env(safe-area-inset-bottom)+1rem)] backdrop-blur-md md:p-5"
          role="dialog"
          aria-label={`Pregled: ${preview.name}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreview(null);
          }}
        >
          <button
            ref={closeButton}
            aria-label="Zatvori pregled"
            className="absolute right-5 top-[calc(env(safe-area-inset-top)+1rem)] min-h-11 px-2 text-xs font-bold tracking-[0.28em] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#f0d7a1] md:right-6 md:top-6 md:min-h-0 md:tracking-[0.35em]"
            onClick={() => setPreview(null)}
          >
            CLOSE
          </button>
          <div className="relative h-[78svh] w-[min(92vw,980px)] overflow-hidden md:h-[84vh]">
            <Image
              src={preview.image}
              alt={preview.imageAlt}
              fill
              sizes="(max-width: 767px) 92vw, 980px"
              className="responsive-image h-full w-full object-cover"
              style={imagePositionStyle(preview.position)}
            />
            <h3 className="absolute bottom-5 left-5 max-w-[82vw] font-serif text-[clamp(2.2rem,11vw,4.2rem)] leading-[0.95] text-white md:bottom-8 md:left-8 md:text-9xl">
              {preview.name}
            </h3>
          </div>
        </div>
      ) : null}
    </section>
  );
}
