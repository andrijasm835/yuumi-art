"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BookingModal } from "@/components/booking/BookingModal";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { makeupProps } from "@/content/site";
import { MOBILE_SCRUB, viewportScrollDistance } from "@/lib/scrollCadence";

export function BookingScene() {
  const scope = useRef<HTMLElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

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
        gsap.set(".final-mirror", { scale: 0.82, opacity: 0.72, rotate: 0, filter: isMobile ? "none" : "blur(2px)" });
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
        entrance
          .to(".final-mirror", { scale: 0.92, opacity: 1, ease: "none" }, 0)
          .to(".booking-reflection", { opacity: 0.25, scale: 1.04, ease: "none" }, 0)
          .to(".ready-top, .ready-bottom", { yPercent: 0, opacity: 1, ease: "none" }, 0);

        if (isMobile) {
          const mobileTl = gsap.timeline({
            scrollTrigger: {
              trigger: scope.current,
              start: "top 82%",
              end: viewportScrollDistance(1),
              scrub: MOBILE_SCRUB,
              invalidateOnRefresh: true,
            },
          });

          mobileTl
            .to(".final-mirror", { scale: 0.94, rotate: 0 }, 0)
            .fromTo(".lipstick-stroke", { scaleX: 0 }, { scaleX: 1 }, 0.18)
            .to(".booking-reflection", { opacity: 0.72, scale: 1 }, 0.16)
            .fromTo(".booking-panel", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1 }, 0.32)
            .to(".final-shine", { xPercent: 130 }, 0.38)
            .to(".ready-top", { xPercent: -2 }, 0)
            .to(".ready-bottom", { xPercent: 2 }, 0);

          return () => {
            entrance.kill();
            mobileTl.kill();
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

        tl.to(".final-mirror", { scale: isMobile ? 0.94 : isTablet ? 1 : 1.05, rotate: 0, filter: "blur(0px)" }, 0)
          .fromTo(".lipstick-stroke", { scaleX: 0 }, { scaleX: 1 }, 0.2)
          .to(".booking-reflection", { opacity: 0.72, scale: 1 }, 0.18)
          .fromTo(".booking-panel", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1 }, 0.38)
          .to(".final-shine", { xPercent: 130 }, 0.42)
          .to(".ready-top", { xPercent: isMobile ? -2 : isTablet ? -5 : -9 }, 0)
          .to(".ready-bottom", { xPercent: isMobile ? 2 : isTablet ? 5 : 10 }, 0);

        return () => {
          entrance.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <section id="book" ref={scope} className="relative h-[var(--scene-vh)] overflow-hidden bg-[#1b1110] text-[#fff7ef] lg:h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(244,226,198,0.16),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(111,29,42,0.35),transparent_30%)]" />
      <Image
        src={makeupProps.lipstick}
        alt=""
        aria-hidden="true"
        width={180}
        height={360}
        className="pointer-events-none absolute -right-[7vw] bottom-[9dvh] h-[19dvh] w-auto rotate-[22deg] opacity-30 md:-right-[2vw] md:bottom-[10dvh] md:h-[23dvh] lg:right-[4vw] lg:bottom-[12vh] lg:h-[26vh]"
      />
      <Image
        src={makeupProps.eyelashCurler}
        alt=""
        aria-hidden="true"
        width={280}
        height={360}
        className="pointer-events-none absolute -left-[12vw] top-[16dvh] h-[18dvh] w-auto rotate-[-14deg] opacity-25 md:-left-[4vw] md:top-[18dvh] md:h-[23dvh] lg:left-[5vw] lg:top-[16vh] lg:h-[27vh]"
      />
      <Image
        src={makeupProps.sponge}
        alt=""
        aria-hidden="true"
        width={220}
        height={300}
        className="pointer-events-none absolute bottom-[7dvh] left-[12vw] hidden h-[11dvh] w-auto rotate-[16deg] opacity-20 md:block lg:left-[18vw] lg:h-[13vh]"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center font-serif text-[clamp(2.7rem,11.5vw,5rem)] leading-[0.86] text-[#fff7ef]/82 md:text-[clamp(4.8rem,10vw,7rem)] lg:text-[clamp(3rem,14vw,9rem)] lg:leading-[0.82]">
        <span className="ready-top">SPREMNA ZA</span>
        <span className="ready-bottom italic">SVOJ LOOK?</span>
      </div>

      <div className="final-mirror glass-reflection absolute left-1/2 top-1/2 isolate h-[66svh] w-[min(82vw,430px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[48%_48%_42%_42%] border-[7px] border-[#c5a56d]/75 bg-[#fff8ef] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.48),inset_0_0_34px_rgba(38,22,18,0.26),0_40px_160px_rgba(0,0,0,0.38)] md:h-[70vh] md:w-[min(68vw,500px)] md:border-[8px] lg:h-[72vh] lg:w-[min(76vw,520px)] lg:border-[10px]">
        <div className="booking-reflection absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.7),transparent_20%),radial-gradient(circle_at_33%_70%,rgba(216,189,128,0.25),transparent_32%),linear-gradient(135deg,#fff8ef_0%,#ead8c2_42%,#c7a982_68%,#f8efe4_100%)] opacity-0" />
        <div className="absolute left-[12%] top-[17%] h-[34%] w-[52%] rotate-[-16deg] rounded-full bg-white/18" />
        <div className="absolute bottom-[12%] right-[8%] h-[30%] w-[38%] rotate-12 rounded-full bg-[#6f1d2a]/9" />
        <div className="absolute inset-[9px] z-20 rounded-[inherit] border border-[#2b1b18]/24 md:inset-[10px]" />
        <div className="absolute inset-[8%] rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_48%,rgba(43,27,24,0.12))]" />
        <div className="absolute inset-0 rounded-[inherit] bg-[#2b211d]/8" />
        <div className="final-shine absolute inset-y-0 left-[-45%] w-1/2 rounded-[inherit] rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="booking-panel relative z-30 grid h-full place-items-center rounded-[inherit] p-6 text-center text-[#6f1d2a] drop-shadow-[0_2px_16px_rgba(255,248,239,0.42)] md:p-8">
          <div>
            <button
              data-cursor="DM"
              className="block font-serif text-[clamp(2.25rem,10vw,4.4rem)] leading-[0.86] tracking-normal text-[#6f1d2a] outline-none transition hover:text-[#241916] focus-visible:text-[#241916] md:text-[clamp(3.2rem,6vw,5.8rem)] lg:text-[clamp(3.2rem,6.6vw,6.6rem)] lg:leading-[0.82]"
              onClick={() => setBookingOpen(true)}
            >
              ZAKAŽI
              <br />
              SVOJ
              <br />
              TERMIN
            </button>
            <div className="mt-6 flex justify-center text-center text-[10px] font-bold tracking-[0.18em] text-[#70574b] md:mt-8 md:text-[11px] md:tracking-[0.26em] lg:mt-9 lg:tracking-[0.3em]">
              <button onClick={() => setBookingOpen(true)} data-cursor="VIEW">
                IZABERI USLUGU I POŠALJI ZAHTEV →
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="lipstick-stroke absolute bottom-[16svh] left-1/2 h-2.5 w-[min(72vw,620px)] origin-left -translate-x-1/2 rotate-[-2deg] rounded-full bg-[#7d1f2d] md:bottom-[17vh] md:h-3 lg:bottom-[18vh]" />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}
