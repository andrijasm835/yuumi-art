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
    "left-5 bottom-6 max-w-[80%] md:left-[5vw] md:bottom-[6vh] md:max-w-[72%]",
  "top-right":
    "right-5 top-16 max-w-[78%] md:right-[5vw] md:top-[8vh] md:max-w-[66%]",
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
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: isMobile ? "+=280%" : "+=340%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        entrance.fromTo(
          track,
          { yPercent: isMobile ? 8 : 10, scale: isMobile ? 1.015 : 1.025, opacity: 0.82 },
          { yPercent: 0, scale: 1, opacity: 1, ease: "none" },
          0,
        );

        timeline
          .to(track, { x: () => -distance(), ease: "none", duration: 3 }, 0)
          .to(".look-image:not(.no-service-zoom)", { scale: isMobile ? 1.025 : 1.055, xPercent: isMobile ? -0.5 : -1.5, stagger: 0.06, duration: 3 }, 0)
          .to(".service-item", { xPercent: isMobile ? -0.5 : -1.5, stagger: 0.06, duration: 3 }, 0)
          .to(scope.current, { backgroundColor: "#211714", ease: "none", duration: 0.78 }, 2.36)
          .to(".service-final-image", { scale: isMobile ? 1.08 : 1.18, xPercent: isMobile ? -1 : -3, yPercent: isMobile ? 1 : 2, filter: isMobile ? "contrast(1.02)" : "contrast(1.04) saturate(1.04)", duration: 0.82 }, 2.38);

        return () => {
          entrance.kill();
          timeline.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section id="work" ref={scope} className="relative h-svh overflow-hidden bg-[#f5eadf] text-[#241916] md:h-screen">
      <div className="absolute left-5 top-8 z-20 text-xs font-bold tracking-[0.38em] text-[#7f665a] md:left-12">
        USLUGE & EDUKACIJE
      </div>
      <div className="looks-track flex h-full w-[390vw] items-center gap-[3vw] px-[7vw] will-change-transform md:gap-[1vw]">
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
                sizes="(max-width: 768px) 82vw, 86vw"
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
              <h2 className="mt-3 font-serif text-[clamp(2.5rem,12vw,5rem)] leading-[0.9] md:text-[clamp(2.8rem,7vw,7.5rem)]">
                {look.nameLines.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-4 max-w-[17rem] text-sm font-medium leading-6 text-current md:mt-5 md:max-w-[30rem] md:text-[1.05rem]">{look.text}</p>
            </div>
          </button>
        ))}
      </div>

      {preview ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[95] grid animate-[previewIn_220ms_ease-out] place-items-center bg-[#160f0c]/88 p-5 backdrop-blur-md"
          role="dialog"
          aria-label={`Pregled: ${preview.name}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreview(null);
          }}
        >
          <button
            ref={closeButton}
            aria-label="Zatvori pregled"
            className="absolute right-6 top-6 text-xs font-bold tracking-[0.35em] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#f0d7a1]"
            onClick={() => setPreview(null)}
          >
            CLOSE
          </button>
          <div className="relative h-[84vh] w-[min(92vw,980px)] overflow-hidden">
            <Image
              src={preview.image}
              alt={preview.imageAlt}
              fill
              sizes="(max-width: 768px) 92vw, 980px"
              className="responsive-image h-full w-full object-cover"
              style={imagePositionStyle(preview.position)}
            />
            <h3 className="absolute bottom-8 left-8 font-serif text-6xl text-white md:text-9xl">
              {preview.name}
            </h3>
          </div>
        </div>
      ) : null}
    </section>
  );
}
