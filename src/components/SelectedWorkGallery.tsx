"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { galleryWorks, makeupProps } from "@/content/site";
import { useGsapScene, gsap } from "@/lib/useGsapScene";

function imagePositionStyle(position: { desktop: string; mobile: string }) {
  return {
    "--image-position-desktop": position.desktop,
    "--image-position-mobile": position.mobile,
  } as CSSProperties;
}

export function SelectedWorkGallery() {
  const scope = useRef<HTMLElement>(null);

  useGsapScene(scope, () => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1024px)",
        tablet: "(min-width: 768px) and (max-width: 1023px)",
      },
      (context) => {
        const isTablet = context.conditions?.tablet;
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
            end: `+=${(count - 1) * (isTablet ? 72 : 88)}%`,
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
    <section ref={scope} className="scene-overlap relative overflow-hidden bg-[#1b1110] text-[#fff7ef] md:h-[100dvh] lg:h-screen">
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

      <div className="relative z-10 px-5 pb-[calc(env(safe-area-inset-bottom)+4rem)] pt-[calc(env(safe-area-inset-top)+4.5rem)] md:hidden">
        <p className="text-[10px] font-bold tracking-[0.34em] text-[#d8bd80]/72">YUUMI ART / RADOVI</p>
        <h2 className="mt-4 font-serif text-[clamp(3.6rem,16vw,5.8rem)] leading-[0.82]">RADOVI</h2>

        <div className="mt-9 space-y-10">
          {galleryWorks.map((work, index) => (
            <figure className="selected-work-mobile" key={work.src}>
              <div className="relative h-[68dvh] w-full overflow-hidden bg-[#2b211d]">
                <Image
                  src={work.src}
                  alt={work.alt}
                  fill
                  priority={index === 0}
                  quality={90}
                  sizes="92vw"
                  className="responsive-image h-full w-full object-cover"
                  style={imagePositionStyle(work.position)}
                />
              </div>
              <figcaption className="mt-3 text-xs font-bold tracking-[0.36em] text-[#d8bd80]">
                {String(index + 1).padStart(2, "0")} / {String(galleryWorks.length).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
