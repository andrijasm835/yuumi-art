import { useId, type SVGProps } from "react";

export function BeautyFace(props: SVGProps<SVGSVGElement>) {
  const rawId = useId().replace(/:/g, "");
  const ids = {
    skin: `beauty-skin-${rawId}`,
    hair: `beauty-hair-${rawId}`,
    iris: `beauty-iris-${rawId}`,
    cheek: `beauty-cheek-${rawId}`,
    softBlur: `beauty-soft-blur-${rawId}`,
    glowBlur: `beauty-glow-blur-${rawId}`,
    skinMask: `beauty-skin-mask-${rawId}`,
    eyeMask: `beauty-eye-mask-${rawId}`,
    colorMask: `beauty-color-mask-${rawId}`,
    finalMask: `beauty-final-mask-${rawId}`,
  };

  return (
    <svg
      viewBox="0 0 1200 1600"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Stilizovana beauty face chart ilustracija"
      {...props}
    >
      <defs>
        <linearGradient id={ids.hair} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#140909" />
          <stop offset="0.58" stopColor="#2d1515" />
          <stop offset="1" stopColor="#553027" />
        </linearGradient>
        <radialGradient id={ids.skin} cx="48%" cy="34%" r="60%">
          <stop offset="0" stopColor="#f8d1bd" />
          <stop offset="0.58" stopColor="#d1927a" />
          <stop offset="1" stopColor="#9a5a50" />
        </radialGradient>
        <radialGradient id={ids.iris} cx="42%" cy="36%" r="58%">
          <stop offset="0" stopColor="#b6aca2" />
          <stop offset="0.62" stopColor="#746964" />
          <stop offset="1" stopColor="#211615" />
        </radialGradient>
        <radialGradient id={ids.cheek} cx="48%" cy="50%" r="58%">
          <stop offset="0" stopColor="#bd5264" stopOpacity="0.34" />
          <stop offset="0.5" stopColor="#bd5264" stopOpacity="0.16" />
          <stop offset="1" stopColor="#bd5264" stopOpacity="0" />
        </radialGradient>
        <filter id={ids.softBlur} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id={ids.glowBlur} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" />
        </filter>

        <mask id={ids.skinMask} maskUnits="userSpaceOnUse">
          <rect width="1200" height="1600" fill="black" />
          <rect
            className="reveal-shape reveal-skin"
            x="320"
            y="410"
            width="560"
            height="690"
            rx="250"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%", transform: "scaleX(0)" }}
          />
        </mask>
        <mask id={ids.eyeMask} maskUnits="userSpaceOnUse">
          <rect width="1200" height="1600" fill="black" />
          <ellipse
            className="reveal-shape reveal-eye-left"
            cx="506"
            cy="672"
            rx="136"
            ry="82"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "100% 50%", transform: "scaleX(0)" }}
          />
          <ellipse
            className="reveal-shape reveal-eye-right"
            cx="694"
            cy="672"
            rx="136"
            ry="82"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%", transform: "scaleX(0)" }}
          />
        </mask>
        <mask id={ids.colorMask} maskUnits="userSpaceOnUse">
          <rect width="1200" height="1600" fill="black" />
          <ellipse className="reveal-shape reveal-cheek-left" cx="456" cy="792" rx="0" ry="0" fill="white" />
          <ellipse className="reveal-shape reveal-cheek-right" cx="744" cy="790" rx="0" ry="0" fill="white" />
          <rect
            className="reveal-shape reveal-lips"
            x="503"
            y="918"
            width="194"
            height="90"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%", transform: "scaleX(0)" }}
          />
        </mask>
        <mask id={ids.finalMask} maskUnits="userSpaceOnUse">
          <rect width="1200" height="1600" fill="black" />
          <rect
            className="reveal-shape reveal-final"
            x="376"
            y="520"
            width="448"
            height="520"
            rx="210"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%", transform: "scaleY(0)" }}
          />
        </mask>
      </defs>

      <rect width="1200" height="1600" fill="#f5e8dd" />
      <ellipse cx="600" cy="740" rx="520" ry="730" fill="#bf8a77" opacity="0.1" filter={`url(#${ids.glowBlur})`} />

      <g className="face-base">
        <path d="M234 1600c92-294 250-414 366-414s274 120 366 414z" fill="#1c0e0e" />
        <path
          d="M296 640c-8-278 110-474 304-474s312 196 304 474c-76-116-170-172-304-172s-228 56-304 172z"
          fill={`url(#${ids.hair})`}
        />
        <path
          d="M348 545c46-178 139-276 252-276s206 98 252 276c-76-62-154-90-252-90s-176 28-252 90z"
          fill="#23100f"
          opacity="0.9"
        />
        <path
          d="M600 292c-142 0-244 146-244 360 0 124 31 244 88 324 43 61 97 100 156 100s113-39 156-100c57-80 88-200 88-324 0-214-102-360-244-360z"
          fill={`url(#${ids.skin})`}
        />
        <path
          d="M420 752c32 166 102 292 180 292s148-126 180-292c-50 45-110 66-180 66s-130-21-180-66z"
          fill="#fff2e8"
          opacity="0.06"
        />

        <path d="M430 605c48-23 101-26 156-8" fill="none" stroke="#3f2320" strokeWidth="6" strokeLinecap="round" opacity="0.72" />
        <path d="M614 597c56-18 112-15 158 10" fill="none" stroke="#3f2320" strokeWidth="6" strokeLinecap="round" opacity="0.72" />
        <path d="M432 620c48-34 103-40 164-18" fill="none" stroke="#2f1917" strokeWidth="5" strokeLinecap="round" opacity="0.44" />
        <path d="M604 603c60-22 116-15 164 20" fill="none" stroke="#2f1917" strokeWidth="5" strokeLinecap="round" opacity="0.44" />

        <path d="M444 676c34-18 92-21 140 0c-42 17-96 17-140 0z" fill="#f7e7df" opacity="0.86" />
        <path d="M616 676c48-21 106-18 140 0c-44 17-98 17-140 0z" fill="#f7e7df" opacity="0.86" />
        <path d="M440 675c48-28 102-29 148-1" fill="none" stroke="#3a201e" strokeWidth="4" strokeLinecap="round" opacity="0.58" />
        <path d="M612 674c46-28 100-27 148 1" fill="none" stroke="#3a201e" strokeWidth="4" strokeLinecap="round" opacity="0.58" />
        <path d="M456 688c34 11 80 11 116 0" fill="none" stroke="#5f332f" strokeWidth="2.5" strokeLinecap="round" opacity="0.32" />
        <path d="M628 688c36 11 82 11 116 0" fill="none" stroke="#5f332f" strokeWidth="2.5" strokeLinecap="round" opacity="0.32" />
        <ellipse cx="516" cy="675" rx="13" ry="14" fill={`url(#${ids.iris})`} />
        <ellipse cx="684" cy="675" rx="13" ry="14" fill={`url(#${ids.iris})`} />
        <circle cx="516" cy="675" r="5.5" fill="#120b0b" />
        <circle cx="684" cy="675" r="5.5" fill="#120b0b" />
        <circle cx="521" cy="670" r="2.8" fill="#fff8ef" opacity="0.88" />
        <circle cx="689" cy="670" r="2.8" fill="#fff8ef" opacity="0.88" />
        <path d="M448 667c10-7 18-10 28-13" stroke="#2d1716" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
        <path d="M752 667c-10-7-18-10-28-13" stroke="#2d1716" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

        <path d="M600 715c-10 36-25 76-22 112c1 18 12 29 28 31" fill="none" stroke="#9b5b50" strokeWidth="4" strokeLinecap="round" opacity="0.56" />
        <path d="M574 858c18 10 36 12 56 1" fill="none" stroke="#7f443e" strokeWidth="3" strokeLinecap="round" opacity="0.42" />
        <path d="M566 883c18 8 50 8 68 0" fill="none" stroke="#fff0e4" strokeWidth="4" strokeLinecap="round" opacity="0.1" />

        <path d="M515 946c25-25 56-33 85-10c29-23 60-15 85 10c-28 23-141 23-170 0z" fill="#9b5a58" opacity="0.88" />
        <path d="M515 947c30 50 140 50 170 0c-34 16-136 16-170 0z" fill="#b87470" opacity="0.72" />
        <path d="M536 944c30-12 98-12 128 0" fill="none" stroke="#6d3637" strokeWidth="3" strokeLinecap="round" opacity="0.38" />
      </g>

      <g className="makeup-layer makeup-skin" mask={`url(#${ids.skinMask})`} opacity="0">
        <path d="M420 616c30-98 92-154 180-154s150 56 180 154c-48-28-106-42-180-42s-132 14-180 42z" fill="#fff4eb" opacity="0.08" filter={`url(#${ids.softBlur})`} />
        <path d="M390 722c40 240 126 352 210 352s170-112 210-352c-58 58-128 86-210 86s-152-28-210-86z" fill="#fff6ed" opacity="0.06" />
        <path d="M452 716c72-48 222-50 296-4" fill="none" stroke="#fff5eb" strokeWidth="28" strokeLinecap="round" opacity="0.08" filter={`url(#${ids.softBlur})`} />
        <path d="M470 820c-36 70-48 118-41 164" fill="none" stroke="#5f2e2b" strokeWidth="20" strokeLinecap="round" opacity="0.08" filter={`url(#${ids.softBlur})`} />
        <path d="M730 820c36 70 48 118 41 164" fill="none" stroke="#5f2e2b" strokeWidth="20" strokeLinecap="round" opacity="0.08" filter={`url(#${ids.softBlur})`} />
        <path d="M548 560c26-28 74-28 104 0" fill="none" stroke="#fff8ef" strokeWidth="12" strokeLinecap="round" opacity="0.1" filter={`url(#${ids.glowBlur})`} />
      </g>

      <g className="makeup-layer makeup-eyes" mask={`url(#${ids.eyeMask})`} opacity="0">
        <path d="M432 652c50-54 120-61 168-13c-54-14-107-8-168 13z" fill="#6f1d2a" opacity="0.28" filter={`url(#${ids.glowBlur})`} />
        <path d="M600 639c48-48 118-41 168 13c-61-21-114-27-168-13z" fill="#6f1d2a" opacity="0.28" filter={`url(#${ids.glowBlur})`} />
        <path d="M432 674c46-36 111-38 162 0" fill="none" stroke="#130b0a" strokeWidth="7" strokeLinecap="round" />
        <path d="M606 674c51-38 116-36 162 0" fill="none" stroke="#130b0a" strokeWidth="7" strokeLinecap="round" />
        <path d="M586 675c16 0 29-5 42-13" fill="none" stroke="#130b0a" strokeWidth="6" strokeLinecap="round" />
        <path d="M614 662c-18 8-30 12-42 12" fill="none" stroke="#130b0a" strokeWidth="6" strokeLinecap="round" />
        <path d="M440 686c24 16 58 22 92 18" fill="none" stroke="#130b0a" strokeWidth="3" strokeLinecap="round" opacity="0.56" />
        <path d="M760 686c-24 16-58 22-92 18" fill="none" stroke="#130b0a" strokeWidth="3" strokeLinecap="round" opacity="0.56" />
        <path d="M436 604c46-24 98-27 152-9" fill="none" stroke="#2b1716" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
        <path d="M612 595c54-18 106-15 152 10" fill="none" stroke="#2b1716" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
      </g>

      <g className="makeup-layer makeup-color" mask={`url(#${ids.colorMask})`} opacity="0">
        <path d="M398 754c70-46 144-34 198 12c-50 42-128 58-210 32z" fill={`url(#${ids.cheek})`} filter={`url(#${ids.softBlur})`} />
        <path d="M804 754c-70-46-144-34-198 12c50 42 128 58 210 32z" fill={`url(#${ids.cheek})`} filter={`url(#${ids.softBlur})`} />
        <path d="M514 946c25-28 56-37 86-12c30-25 61-16 86 12c-31 25-141 25-172 0z" fill="#6f1d2a" opacity="0.88" />
        <path d="M514 947c31 52 141 52 172 0c-38 18-134 18-172 0z" fill="#8c3b4a" opacity="0.9" />
        <path d="M534 943c32-12 100-12 132 0" fill="none" stroke="#d79aa0" strokeWidth="4" strokeLinecap="round" opacity="0.42" />
      </g>

      <g className="makeup-layer makeup-final" mask={`url(#${ids.finalMask})`} opacity="0">
        <path d="M455 802c46 18 100 17 146-1" fill="none" stroke="#fff8ef" strokeWidth="6" strokeLinecap="round" opacity="0.16" filter={`url(#${ids.glowBlur})`} />
        <path d="M599 802c46 18 100 17 146-1" fill="none" stroke="#fff8ef" strokeWidth="6" strokeLinecap="round" opacity="0.14" filter={`url(#${ids.glowBlur})`} />
        <circle cx="666" cy="646" r="7" fill="#fff8ef" opacity="0.34" filter={`url(#${ids.glowBlur})`} />
        <circle cx="760" cy="775" r="13" fill="#fff8ef" opacity="0.18" filter={`url(#${ids.glowBlur})`} />
        <path d="M548 956c34 9 70 9 104 0" stroke="#fff8ef" strokeWidth="4" opacity="0.22" strokeLinecap="round" />
        <path d="M600 510c44 10 90 34 132 74" fill="none" stroke="#fff8ef" strokeWidth="5" strokeLinecap="round" opacity="0.09" filter={`url(#${ids.glowBlur})`} />
      </g>

      <rect width="1200" height="1600" fill="#160d0c" opacity="0.035" />
    </svg>
  );
}
