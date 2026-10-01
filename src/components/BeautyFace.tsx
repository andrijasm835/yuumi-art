import { useId, type SVGProps } from "react";

export function BeautyFace(props: SVGProps<SVGSVGElement>) {
  const rawId = useId().replace(/:/g, "");
  const ids = {
    skin: `skin-${rawId}`,
    skinLight: `skin-light-${rawId}`,
    hair: `hair-${rawId}`,
    iris: `iris-${rawId}`,
    lipsBase: `lips-base-${rawId}`,
    cheek: `cheek-${rawId}`,
    contour: `contour-${rawId}`,
    shadow: `shadow-${rawId}`,
    blur: `blur-${rawId}`,
    softBlur: `soft-blur-${rawId}`,
    skinMask: `skin-mask-${rawId}`,
    eyeMask: `eye-mask-${rawId}`,
    colorMask: `color-mask-${rawId}`,
    finalMask: `final-mask-${rawId}`,
  };

  return (
    <svg
      viewBox="0 0 1200 1600"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Stilizovana beauty portret ilustracija"
      {...props}
    >
      <defs>
        <radialGradient id={ids.skin} cx="43%" cy="26%" r="74%">
          <stop offset="0" stopColor="#ffe0cb" />
          <stop offset="0.45" stopColor="#d99b82" />
          <stop offset="0.78" stopColor="#a7645b" />
          <stop offset="1" stopColor="#76413f" />
        </radialGradient>
        <radialGradient id={ids.skinLight} cx="34%" cy="22%" r="78%">
          <stop offset="0" stopColor="#fff8ef" stopOpacity="0.52" />
          <stop offset="0.46" stopColor="#fff8ef" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff8ef" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.hair} x1="0.22" x2="0.82" y1="0.05" y2="1">
          <stop offset="0" stopColor="#100707" />
          <stop offset="0.52" stopColor="#2a1313" />
          <stop offset="1" stopColor="#684134" />
        </linearGradient>
        <radialGradient id={ids.iris} cx="38%" cy="33%" r="65%">
          <stop offset="0" stopColor="#c7b6a8" />
          <stop offset="0.48" stopColor="#6f625c" />
          <stop offset="1" stopColor="#17100f" />
        </radialGradient>
        <linearGradient id={ids.lipsBase} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#b36d69" />
          <stop offset="0.52" stopColor="#935552" />
          <stop offset="1" stopColor="#c2877e" />
        </linearGradient>
        <radialGradient id={ids.cheek} cx="48%" cy="52%" r="60%">
          <stop offset="0" stopColor="#bd5264" stopOpacity="0.48" />
          <stop offset="0.55" stopColor="#bd5264" stopOpacity="0.2" />
          <stop offset="1" stopColor="#bd5264" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.contour} x1="0" x2="1">
          <stop offset="0" stopColor="#522525" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#522525" stopOpacity="0" />
          <stop offset="1" stopColor="#fff4e8" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={ids.shadow} x1="0" x2="1">
          <stop offset="0" stopColor="#fff3e8" stopOpacity="0.18" />
          <stop offset="1" stopColor="#3b1719" stopOpacity="0.34" />
        </linearGradient>
        <filter id={ids.blur} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id={ids.softBlur} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="24" />
        </filter>

        <mask id={ids.skinMask} maskUnits="userSpaceOnUse">
          <rect width="1200" height="1600" fill="black" />
          <path
            className="reveal-shape reveal-skin"
            d="M366 408c76-116 168-170 278-156c124 16 198 122 204 278c8 212-78 438-244 438c-156 0-244-188-238-560z"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%", transform: "scaleX(0)" }}
          />
        </mask>
        <mask id={ids.eyeMask} maskUnits="userSpaceOnUse">
          <rect width="1200" height="1600" fill="black" />
          <ellipse
            className="reveal-shape reveal-eye-left"
            cx="512"
            cy="500"
            rx="126"
            ry="70"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "100% 50%", transform: "scaleX(0)" }}
          />
          <ellipse
            className="reveal-shape reveal-eye-right"
            cx="704"
            cy="500"
            rx="126"
            ry="70"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%", transform: "scaleX(0)" }}
          />
        </mask>
        <mask id={ids.colorMask} maskUnits="userSpaceOnUse">
          <rect width="1200" height="1600" fill="black" />
          <ellipse className="reveal-shape reveal-cheek-left" cx="458" cy="684" rx="0" ry="0" fill="white" />
          <ellipse className="reveal-shape reveal-cheek-right" cx="748" cy="680" rx="0" ry="0" fill="white" />
          <rect
            className="reveal-shape reveal-lips"
            x="511"
            y="832"
            width="206"
            height="100"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%", transform: "scaleX(0)" }}
          />
        </mask>
        <mask id={ids.finalMask} maskUnits="userSpaceOnUse">
          <rect width="1200" height="1600" fill="black" />
          <path
            className="reveal-shape reveal-final"
            d="M404 486c72-94 160-134 266-116c108 18 174 106 174 232c0 212-84 392-240 392c-140 0-218-178-200-508z"
            fill="white"
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%", transform: "scaleY(0)" }}
          />
        </mask>
      </defs>

      <rect width="1200" height="1600" fill="#f3e4d8" />
      <ellipse cx="612" cy="704" rx="430" ry="610" fill="#7b4d43" opacity="0.1" filter={`url(#${ids.softBlur})`} />

      <g className="face-base">
        <image
          href="/yummi/beauty-mannequin-base.png"
          x="0"
          y="0"
          width="1200"
          height="1600"
          preserveAspectRatio="xMidYMid slice"
        />
      </g>

      <g className="makeup-layer makeup-skin" mask={`url(#${ids.skinMask})`} opacity="0">
        <ellipse cx="586" cy="538" rx="200" ry="260" fill="#fff8ef" opacity="0.055" filter={`url(#${ids.softBlur})`} />
        <ellipse cx="492" cy="660" rx="118" ry="78" fill="#fff1e4" opacity="0.045" filter={`url(#${ids.softBlur})`} />
        <ellipse cx="742" cy="654" rx="118" ry="78" fill="#4e2323" opacity="0.055" filter={`url(#${ids.softBlur})`} />
        <path d="M526 470c46-24 126-24 174 2" stroke="#fff8ef" strokeWidth="14" strokeLinecap="round" opacity="0.09" filter={`url(#${ids.blur})`} />
        <path d="M560 742c42 12 102 11 144-4" stroke="#fff8ef" strokeWidth="8" strokeLinecap="round" opacity="0.08" filter={`url(#${ids.blur})`} />
      </g>

      <g className="makeup-layer makeup-eyes" mask={`url(#${ids.eyeMask})`} opacity="0">
        <path d="M438 520c62-62 136-70 194-14c-68-22-132-15-194 14z" fill="#6f1d2a" opacity="0.42" filter={`url(#${ids.blur})`} />
        <path d="M618 506c64-56 138-48 198 16c-68-31-132-38-198-16z" fill="#6f1d2a" opacity="0.42" filter={`url(#${ids.blur})`} />
        <path d="M438 552c56-38 124-39 180-1" fill="none" stroke="#0d0707" strokeWidth="10" strokeLinecap="round" />
        <path d="M630 550c56-36 126-34 180 6" fill="none" stroke="#0d0707" strokeWidth="10" strokeLinecap="round" />
        <path d="M612 550c16 1 31-5 48-18" fill="none" stroke="#0d0707" strokeWidth="8" strokeLinecap="round" />
        <path d="M636 532c-17 13-32 19-48 18" fill="none" stroke="#0d0707" strokeWidth="8" strokeLinecap="round" />
        <path d="M452 576c24 22 62 32 108 29" fill="none" stroke="#0d0707" strokeWidth="4" strokeLinecap="round" opacity="0.68" />
        <path d="M798 578c-26 21-64 31-110 27" fill="none" stroke="#0d0707" strokeWidth="4" strokeLinecap="round" opacity="0.68" />
        <path d="M458 500c42-19 84-22 132-8" fill="none" stroke="#2a1413" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        <path d="M652 490c48-12 92-8 132 13" fill="none" stroke="#2a1413" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      </g>

      <g className="makeup-layer makeup-color" mask={`url(#${ids.colorMask})`} opacity="0">
        <path d="M396 712c78-66 166-54 226 8c-64 54-150 70-242 42z" fill={`url(#${ids.cheek})`} filter={`url(#${ids.softBlur})`} />
        <path d="M838 704c-82-58-168-44-226 20c66 50 152 60 244 28z" fill={`url(#${ids.cheek})`} filter={`url(#${ids.softBlur})`} />
        <path d="M420 678c48 100 128 150 240 148" fill="none" stroke="#b96b44" strokeWidth="26" strokeLinecap="round" opacity="0.08" filter={`url(#${ids.blur})`} />
        <path d="M508 850c34-31 70-38 104-13c36-26 76-16 110 15c-42 27-176 27-214-2z" fill="#672035" opacity="0.72" />
        <path d="M508 852c40 52 176 52 214 0c-52 19-162 19-214 0z" fill="#8f3e4f" opacity="0.78" />
        <path d="M536 850c44-12 116-12 158 0" fill="none" stroke="#e0a0a0" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </g>

      <g className="makeup-layer makeup-final" mask={`url(#${ids.finalMask})`} opacity="0">
        <path d="M452 722c42 16 92 14 142-6" fill="none" stroke="#fff8ef" strokeWidth="8" strokeLinecap="round" opacity="0.18" filter={`url(#${ids.blur})`} />
        <path d="M636 714c52 20 102 18 148 0" fill="none" stroke="#fff8ef" strokeWidth="8" strokeLinecap="round" opacity="0.16" filter={`url(#${ids.blur})`} />
        <circle cx="658" cy="524" r="9" fill="#fff8ef" opacity="0.44" filter={`url(#${ids.blur})`} />
        <circle cx="500" cy="740" r="18" fill="#fff8ef" opacity="0.2" filter={`url(#${ids.blur})`} />
        <circle cx="742" cy="734" r="16" fill="#fff8ef" opacity="0.18" filter={`url(#${ids.blur})`} />
        <path d="M548 868c38 9 92 9 132 0" stroke="#fff8ef" strokeWidth="5" opacity="0.28" strokeLinecap="round" />
        <path d="M472 540c12-22 30-36 54-42" stroke="#fff8ef" strokeWidth="4" opacity="0.2" strokeLinecap="round" />
        <path d="M728 500c24 6 44 20 60 42" stroke="#fff8ef" strokeWidth="4" opacity="0.18" strokeLinecap="round" />
      </g>

      <rect width="1200" height="1600" fill="#160d0d" opacity="0.025" />
    </svg>
  );
}
