"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { galleryWorks, makeupProps } from "@/content/site";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { MOBILE_SCRUB, viewportScrollDistance } from "@/lib/scrollCadence";

function imagePositionStyle(position: { desktop: string; mobile: string }) {
  return {
    "--image-position-desktop": position.desktop,
    "--image-position-mobile": position.mobile,
  } as CSSProperties;
}

const warmedGalleryImages = new Set<number>();

function decodeGalleryImage(index: number) {
  const work = galleryWorks[index];
  if (!work || typeof window === "undefined") return;
  if (warmedGalleryImages.has(index)) return;

  warmedGalleryImages.add(index);

  try {
    const image = new window.Image();
    image.decoding = "async";
    image.src = work.src;
    void image.decode?.().catch(() => undefined);
  } catch {
    warmedGalleryImages.delete(index);
  }
}

export function SelectedWorkGallery() {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const warmUpcomingImages = () => {
      decodeGalleryImage(1);
      decodeGalleryImage(2);
    };
    const idleId = window.requestIdleCallback ? window.requestIdleCallback(warmUpcomingImages, { timeout: 1400 }) : undefined;
    const timer = idleId ? undefined : window.setTimeout(warmUpcomingImages, 700);

    return () => {
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useGsapScene(scope, () => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1024px)",
        tablet: "(min-width: 768px) and (max-width: 1023px)",
        mobile: "(max-width: 767px)",
      },
      (context) => {
        const isTablet = context.conditions?.tablet;
        const isMobile = context.conditions?.mobile;

        if (isMobile) {
          const mobileWorks = gsap.utils.toArray<HTMLElement>(".selected-work-mobile-slide");
          const mobileCount = mobileWorks.length;

          gsap.set(mobileWorks, { yPercent: 105, autoAlpha: 0, willChange: "transform, opacity" });
          gsap.set(mobileWorks[0], { yPercent: 0, scale: 1, autoAlpha: 1 });
          gsap.set(".selected-work-mobile-number", { autoAlpha: 0, y: 10 });
          gsap.set(".selected-work-mobile-number-0", { autoAlpha: 1, y: 0 });

          const mobileTl = gsap.timeline({
            scrollTrigger: {
              trigger: scope.current,
              start: "top top",
              end: viewportScrollDistance(mobileCount - 1, 0.78),
              scrub: MOBILE_SCRUB,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const nextIndex = Math.min(mobileCount - 1, Math.floor(self.progress * (mobileCount - 1)) + 1);
                decodeGalleryImage(nextIndex);
                decodeGalleryImage(nextIndex + 1);
              },
            },
          });

          for (let index = 1; index < mobileCount; index += 1) {
            const at = index - 1;

            mobileTl
              .to(mobileWorks[index - 1], { yPercent: -105, autoAlpha: 0.28, duration: 0.76, ease: "power1.inOut" }, at)
              .to(mobileWorks[index], { yPercent: 0, autoAlpha: 1, duration: 0.76, ease: "power1.inOut" }, at)
              .to(`.selected-work-mobile-number-${index - 1}`, { autoAlpha: 0, y: -10, duration: 0.2 }, at)
              .to(`.selected-work-mobile-number-${index}`, { autoAlpha: 1, y: 0, duration: 0.24 }, at + 0.16);
          }

          return () => {
            gsap.set(mobileWorks, { clearProps: "willChange" });
            mobileTl.kill();
          };
        }

        const works = gsap.utils.toArray<HTMLElement>(".selected-work");
        const count = works.length;

        gsap.set(works, { yPercent: 112, scale: 1.02, autoAlpha: 0 });
        gsap.set(works[0], { yPercent: 0, scale: 1, autoAlpha: 1 });
        gsap.set(".selected-work-number", { autoAlpha: 0, y: 12 });
        gsap.set(".selected-work-number-0", { autoAlpha: 1, y: 0 });
        gsap.set(".selected-work-prop", { autoAlpha: 0.5 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: isTablet ? viewportScrollDistance(count - 1, 0.9) : `+=${(count - 1) * 88}%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let index = 1; index < count; index += 1) {
          const at = index - 1;

          tl.to(works[index - 1], { yPercent: -110, scale: 0.98, autoAlpha: 0.38, duration: 0.82, ease: "power1.inOut" }, at)
            .to(works[index], { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.82, ease: "power1.inOut" }, at)
            .to(`.selected-work-number-${index - 1}`, { autoAlpha: 0, y: -12, duration: 0.22 }, at)
            .to(`.selected-work-number-${index}`, { autoAlpha: 1, y: 0, duration: 0.28 }, at + 0.18)
            .to(".selected-work-prop-brush", { x: index % 2 === 0 ? -18 : 16, y: index % 3 === 0 ? -10 : 14, rotate: index % 2 === 0 ? -31 : -18, duration: 0.82, ease: "power1.inOut" }, at)
            .to(".selected-work-prop-compact", { x: index % 2 === 0 ? 16 : -14, y: index % 3 === 0 ? 14 : -8, rotate: index % 2 === 0 ? 8 : -7, duration: 0.82, ease: "power1.inOut" }, at)
            .to(".selected-work-prop-lipstick", { x: index % 2 === 0 ? -10 : 14, y: index % 3 === 0 ? 8 : -14, rotate: index % 2 === 0 ? 23 : 34, duration: 0.82, ease: "power1.inOut" }, at);
        }

        tl.to(".selected-work-frame", { yPercent: -4, scale: 0.99, duration: 0.6, ease: "none" }, count - 1);

        return () => tl.kill();
      },
    );

    return () => mm.revert();
  });

  return (
    <section ref={scope} className="scene-overlap relative h-[var(--scene-vh)] overflow-hidden bg-[#1b1110] text-[#fff7ef] lg:h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(111,29,42,0.24),transparent_34%),radial-gradient(circle_at_12%_78%,rgba(216,189,128,0.14),transparent_32%),linear-gradient(120deg,#160f0c_0%,#241613_52%,#17100e_100%)]" />

      <div className="relative z-10 hidden h-full md:block">
        <div className="absolute left-8 top-[8dvh] max-w-[18rem] lg:left-12 lg:top-[10vh]">
          <p className="text-[10px] font-bold tracking-[0.38em] text-[#d8bd80]/70">YUUMI ART / SELECTED WORK</p>
          <h2 className="mt-6 font-serif text-[clamp(4.8rem,9vw,9rem)] leading-[0.8] text-[#fff7ef]">RADOVI</h2>
          <div className="relative mt-7 h-10">
            {galleryWorks.map((work, index) => (
              <p className={`selected-work-number selected-work-number-${index} absolute left-0 top-0 text-sm font-bold tracking-[0.42em] text-[#d8bd80]`} key={work.src}>
                {String(index + 1).padStart(2, "0")} / {String(galleryWorks.length).padStart(2, "0")}
              </p>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-[11dvh] left-[7vw] h-[28dvh] w-[29vw] md:left-[6vw] md:w-[31vw] lg:bottom-[10vh] lg:left-[8vw] lg:w-[27vw]">
          <div className="absolute inset-x-[18%] bottom-[4%] h-8 rounded-full bg-black/20 blur-xl" />
          <Image
            src={makeupProps.brush}
            alt=""
            aria-hidden="true"
            width={110}
            height={260}
            className="selected-work-prop selected-work-prop-brush absolute bottom-[2%] left-[4%] h-[23dvh] w-auto rotate-[-24deg] opacity-50 drop-shadow-2xl lg:h-[25vh]"
          />
          <Image
            src={makeupProps.compact}
            alt=""
            aria-hidden="true"
            width={170}
            height={170}
            className="selected-work-prop selected-work-prop-compact absolute bottom-[18%] left-[34%] h-[12dvh] w-auto rotate-[4deg] opacity-42 drop-shadow-xl lg:h-[13vh]"
          />
          <Image
            src={makeupProps.lipstick}
            alt=""
            aria-hidden="true"
            width={95}
            height={190}
            className="selected-work-prop selected-work-prop-lipstick absolute bottom-[6%] right-[6%] h-[17dvh] w-auto rotate-[28deg] opacity-54 drop-shadow-2xl lg:h-[19vh]"
          />
        </div>

        <div className="selected-work-frame absolute right-[5vw] top-1/2 h-[78dvh] w-[54vw] -translate-y-1/2 overflow-hidden md:right-[4vw] md:h-[74dvh] md:w-[61vw] lg:right-[7vw] lg:h-[82vh] lg:w-[48vw]">
          {galleryWorks.map((work, index) => (
            <div className={`selected-work selected-work-${index} absolute inset-0 overflow-hidden bg-[#2b211d]`} key={work.src}>
              <Image
                src={work.src}
                alt={work.alt}
                fill
                priority={index === 0}
                quality={92}
                sizes="(max-width: 1023px) 61vw, 48vw"
                className="responsive-image h-full w-full object-cover"
                style={imagePositionStyle(work.position)}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,15,12,0.12),transparent_34%,rgba(22,15,12,0.2))]" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 h-full px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-[calc(env(safe-area-inset-top)+2rem)] md:hidden">
        <p className="text-[10px] font-bold tracking-[0.34em] text-[#d8bd80]/72">YUUMI ART / RADOVI</p>
        <h2 className="mt-3 font-serif text-[clamp(3.25rem,15vw,5.2rem)] leading-[0.82]">RADOVI</h2>

        <div className="relative mt-5 h-[calc(var(--scene-vh)*0.68)] w-full overflow-hidden">
          {galleryWorks.map((work, index) => (
            <figure className="selected-work-mobile-slide absolute inset-0" key={work.src}>
              <div className="relative h-full w-full overflow-hidden bg-[#2b211d]">
                <Image
                  src={work.src}
                  alt={work.alt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  quality={90}
                  sizes="92vw"
                  className="responsive-image h-full w-full object-cover"
                  style={imagePositionStyle(work.position)}
                />
              </div>
            </figure>
          ))}
        </div>

        <div className="relative mt-4 h-6">
          {galleryWorks.map((work, index) => (
            <p className={`selected-work-mobile-number selected-work-mobile-number-${index} absolute left-0 top-0 text-xs font-bold tracking-[0.36em] text-[#d8bd80]`} key={work.src}>
                {String(index + 1).padStart(2, "0")} / {String(galleryWorks.length).padStart(2, "0")}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
