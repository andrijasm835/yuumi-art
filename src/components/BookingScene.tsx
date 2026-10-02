"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { BookingModal } from "@/components/booking/BookingModal";
import { useGsapScene, gsap } from "@/lib/useGsapScene";
import { booking } from "@/content/site";

function imagePositionStyle(position: { desktop: string; mobile: string }) {
  return {
    "--image-position-desktop": position.desktop,
    "--image-position-mobile": position.mobile,
  } as CSSProperties;
}

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
            end: isMobile ? "+=115%" : isTablet ? "+=150%" : "+=180%",
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

        tl.to(".final-mirror", { scale: isMobile ? 0.94 : isTablet ? 1 : 1.05, rotate: 0, filter: "blur(0px)" }, 0)
          .fromTo(".lipstick-stroke", { scaleX: 0 }, { scaleX: 1 }, 0.2)
          .to(".booking-reflection", { opacity: 0.72, scale: 1 }, 0.18)
          .fromTo(".booking-panel", { clipPath: "circle(0% at 50% 50%)", opacity: 0 }, { clipPath: "circle(84% at 50% 50%)", opacity: 1 }, 0.38)
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
    <section id="book" ref={scope} className="relative h-[100dvh] overflow-hidden bg-[#1b1110] text-[#fff7ef] lg:h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(244,226,198,0.16),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(111,29,42,0.35),transparent_30%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center font-serif text-[clamp(2.7rem,11.5vw,5rem)] leading-[0.86] text-[#fff7ef]/82 md:text-[clamp(4.8rem,10vw,7rem)] lg:text-[clamp(3rem,14vw,9rem)] lg:leading-[0.82]">
        <span className="ready-top">SPREMNA ZA</span>
        <span className="ready-bottom italic">SVOJ LOOK?</span>
      </div>

      <div className="final-mirror glass-reflection absolute left-1/2 top-1/2 h-[66svh] w-[min(82vw,430px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[48%_48%_42%_42%] border border-[#d8bd80]/50 bg-[#fff7ef]/10 shadow-[0_40px_160px_rgba(0,0,0,0.38)] backdrop-blur-sm md:h-[70vh] md:w-[min(68vw,500px)] lg:h-[72vh] lg:w-[min(76vw,520px)]">
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
        <div className="booking-panel relative z-10 grid h-full place-items-center p-6 text-center text-[#fff7ef] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] md:p-8">
          <div>
            <button
              data-cursor="DM"
              className="block font-serif text-[clamp(2.25rem,10vw,4.4rem)] leading-[0.86] tracking-normal text-[#fff7ef] outline-none transition hover:text-[#f0d7a1] focus-visible:text-[#f0d7a1] md:text-[clamp(3.2rem,6vw,5.8rem)] lg:text-[clamp(3.2rem,6.6vw,6.6rem)] lg:leading-[0.82]"
              onClick={() => setBookingOpen(true)}
            >
              ZAKAŽI
              <br />
              SVOJ
              <br />
              TERMIN
            </button>
            <div className="mt-6 flex justify-center text-center text-[10px] font-bold tracking-[0.18em] text-[#fff7ef] md:mt-8 md:text-[11px] md:tracking-[0.26em] lg:mt-9 lg:tracking-[0.3em]">
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
