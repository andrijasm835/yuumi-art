"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { booking, brand } from "@/content/site";

function imagePositionStyle(position: { desktop: string; mobile: string }) {
  return {
    "--image-position-desktop": position.desktop,
    "--image-position-mobile": position.mobile,
  } as CSSProperties;
}

export function BookingScene() {
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
        gsap.set(".final-mirror", { scale: 0.82, opacity: 0.72, rotate: 0, filter: "blur(2px)" });
        gsap.set(".booking-reflection", { opacity: 0, scale: 1.08 });
        gsap.set(".ready-top, .ready-bottom", { yPercent: 10, opacity: 0.76 });

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
            end: isMobile ? "+=130%" : "+=180%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        entrance
          .to(".final-mirror", { scale: 0.92, opacity: 1, ease: "none" }, 0)
          .to(".booking-reflection", { opacity: 0.25, scale: 1.04, ease: "none" }, 0)
          .to(".ready-top, .ready-bottom", { yPercent: 0, opacity: 1, ease: "none" }, 0);

        tl.to(".final-mirror", { scale: isMobile ? 0.98 : 1.05, rotate: 0, filter: "blur(0px)" }, 0)
          .fromTo(".lipstick-stroke", { scaleX: 0 }, { scaleX: 1 }, 0.2)
          .to(".booking-reflection", { opacity: 0.72, scale: 1 }, 0.18)
          .fromTo(".booking-panel", { clipPath: "circle(0% at 50% 50%)", opacity: 0 }, { clipPath: "circle(84% at 50% 50%)", opacity: 1 }, 0.38)
          .to(".final-shine", { xPercent: 130 }, 0.42)
          .to(".ready-top", { xPercent: isMobile ? -3 : -9 }, 0)
          .to(".ready-bottom", { xPercent: isMobile ? 3 : 10 }, 0);

        return () => {
          entrance.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section id="book" ref={scope} className="relative h-svh overflow-hidden bg-[#1b1110] text-[#fff7ef] md:h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(244,226,198,0.16),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(111,29,42,0.35),transparent_30%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-serif text-[clamp(3rem,14vw,9rem)] leading-[0.82] text-[#fff7ef]/82">
        <span className="ready-top">SPREMNA ZA</span>
        <span className="ready-bottom italic">SVOJ LOOK?</span>
      </div>

      <div className="final-mirror glass-reflection absolute left-1/2 top-1/2 h-[70svh] w-[min(84vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[48%_48%_42%_42%] border border-[#d8bd80]/50 bg-[#fff7ef]/10 shadow-[0_40px_160px_rgba(0,0,0,0.38)] backdrop-blur-sm md:h-[72vh] md:w-[min(76vw,520px)]">
        <Image
          src={booking.reflection}
          alt={booking.reflectionAlt}
          fill
          sizes="520px"
          className="responsive-image booking-reflection object-cover opacity-0"
          style={imagePositionStyle(booking.position)}
        />
        <div className="absolute inset-0 bg-[#fff7ef]/18 mix-blend-screen" />
        <div className="final-shine absolute inset-y-0 left-[-45%] w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="booking-panel relative z-10 grid h-full place-items-center p-8 text-center text-[#fff7ef] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
          <div>
            <a
              data-cursor="DM"
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-serif text-[clamp(2.7rem,12vw,6.4rem)] leading-[0.82] tracking-normal text-[#fff7ef] outline-none transition hover:text-[#f0d7a1] focus-visible:text-[#f0d7a1] md:text-[clamp(3.2rem,6.6vw,6.6rem)]"
            >
              ZAKAŽI
              <br />
              PREKO
              <br />
              INSTAGRAMA ↗
            </a>
            <div className="mt-8 flex justify-center text-[10px] font-bold tracking-[0.26em] text-[#fff7ef] md:mt-9 md:text-[11px] md:tracking-[0.3em]">
              <a href={brand.instagram} target="_blank" rel="noopener noreferrer" data-cursor="VIEW">
                INSTAGRAM
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="lipstick-stroke absolute bottom-[18vh] left-1/2 h-3 w-[min(72vw,620px)] origin-left -translate-x-1/2 rotate-[-2deg] rounded-full bg-[#7d1f2d]" />
    </section>
  );
}
