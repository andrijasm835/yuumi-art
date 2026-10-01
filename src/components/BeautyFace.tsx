import type { SVGProps } from "react";

export function BeautyFace(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1200 1600"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Stilizovana beauty face chart ilustracija"
      {...props}
    >
      <defs>
        <linearGradient id="beauty-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f8e9dd" />
          <stop offset="0.52" stopColor="#d5a695" />
          <stop offset="1" stopColor="#2c1817" />
        </linearGradient>
        <linearGradient id="beauty-hair" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#13090a" />
          <stop offset="0.58" stopColor="#2f1717" />
          <stop offset="1" stopColor="#563027" />
        </linearGradient>
        <radialGradient id="beauty-skin" cx="50%" cy="38%" r="48%">
          <stop offset="0" stopColor="#f3c7b2" />
          <stop offset="0.62" stopColor="#cf8f78" />
          <stop offset="1" stopColor="#99574f" />
        </radialGradient>
        <radialGradient id="beauty-light" cx="44%" cy="28%" r="70%">
          <stop offset="0" stopColor="#fff8ef" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff8ef" stopOpacity="0" />
        </radialGradient>
        <filter id="beauty-soft-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <rect width="1200" height="1600" fill="url(#beauty-bg)" />
      <rect width="1200" height="1600" fill="url(#beauty-light)" />

      <g className="face-base">
        <path d="M210 1600c90-292 247-414 390-414s300 122 390 414z" fill="#1d0f0f" />
        <path
          d="M286 630c-4-258 112-448 314-448s318 190 314 448c-70-108-164-160-314-160s-244 52-314 160z"
          fill="url(#beauty-hair)"
        />
        <path
          d="M344 565c42-204 137-312 256-312s214 108 256 312c-82-68-160-99-256-99s-174 31-256 99z"
          fill="#241211"
          opacity="0.88"
        />
        <path
          d="M600 286c-151 0-256 156-256 380 0 130 34 246 94 326 43 58 98 96 162 96s119-38 162-96c60-80 94-196 94-326 0-224-105-380-256-380z"
          fill="url(#beauty-skin)"
        />
        <path
          d="M398 721c40 226 123 367 202 367s162-141 202-367c-52 50-120 75-202 75s-150-25-202-75z"
          fill="#7c3f39"
          opacity="0.05"
        />
        <path
          d="M424 626c61-36 130-39 194-9"
          fill="none"
          stroke="#3b211f"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M682 617c64-31 134-27 194 10"
          fill="none"
          stroke="#3b211f"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M435 680c50-20 104-19 151 3"
          fill="none"
          stroke="#4b2925"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M708 682c50-22 106-20 151 0"
          fill="none"
          stroke="#4b2925"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M468 691c34-18 77-19 118 1c-36 15-78 15-118-1z" fill="#f2d7cf" opacity="0.58" />
        <path d="M714 692c36-20 82-20 124 0c-38 15-82 15-124 0z" fill="#f2d7cf" opacity="0.58" />
        <ellipse cx="526" cy="694" rx="13" ry="11" fill="#655b58" />
        <ellipse cx="778" cy="694" rx="13" ry="11" fill="#655b58" />
        <circle cx="526" cy="694" r="7" fill="#160d0c" />
        <circle cx="778" cy="694" r="7" fill="#160d0c" />
        <circle cx="530" cy="690" r="3" fill="#fff8ef" opacity="0.82" />
        <circle cx="782" cy="690" r="3" fill="#fff8ef" opacity="0.82" />
        <path
          d="M600 724c-15 72-26 119-4 145"
          fill="none"
          stroke="#8d5148"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.68"
        />
        <path
          d="M566 887c24 11 46 12 68 0"
          fill="none"
          stroke="#8d5148"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M528 949c46 22 98 22 144 0"
          fill="none"
          stroke="#8f504a"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M410 526c62-45 126-68 190-68s128 23 190 68"
          fill="none"
          stroke="#fff8ef"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.08"
        />
      </g>

      <g className="makeup-layer makeup-skin" opacity="0">
        <path
          d="M424 716c48-40 110-58 176-58s128 18 176 58c-38 36-96 58-176 58s-138-22-176-58z"
          fill="#fff2e7"
          opacity="0.15"
        />
        <ellipse cx="474" cy="792" rx="76" ry="48" fill="#f4b9a4" opacity="0.16" />
        <ellipse cx="728" cy="792" rx="76" ry="48" fill="#f4b9a4" opacity="0.14" />
        <path d="M468 565c70-34 188-38 264-6" stroke="#fff8ef" strokeWidth="15" strokeLinecap="round" opacity="0.12" />
        <path d="M458 875c66 70 218 70 284 0" stroke="#fff8ef" strokeWidth="8" strokeLinecap="round" opacity="0.08" />
      </g>

      <g className="makeup-layer makeup-eyes" opacity="0">
        <path d="M408 676c72-39 149-37 216 4" fill="none" stroke="#130b0a" strokeWidth="13" strokeLinecap="round" />
        <path d="M670 680c75-42 154-40 218 1" fill="none" stroke="#130b0a" strokeWidth="13" strokeLinecap="round" />
        <path d="M430 710c52-20 108-18 156 1" fill="none" stroke="#6f1d2a" strokeWidth="6" opacity="0.76" />
        <path d="M704 710c52-20 110-19 160 0" fill="none" stroke="#6f1d2a" strokeWidth="6" opacity="0.76" />
        <path d="M418 650c62-42 132-48 204-15" stroke="#2b1716" strokeWidth="6" strokeLinecap="round" opacity="0.72" />
        <path d="M681 636c72-33 146-28 206 16" stroke="#2b1716" strokeWidth="6" strokeLinecap="round" opacity="0.72" />
      </g>

      <g className="makeup-layer makeup-color" opacity="0">
        <ellipse cx="470" cy="798" rx="78" ry="52" fill="#b44b61" opacity="0.23" />
        <ellipse cx="730" cy="798" rx="78" ry="52" fill="#b44b61" opacity="0.21" />
        <path d="M514 946c54 38 118 38 172 0" fill="none" stroke="#6f1d2a" strokeWidth="22" strokeLinecap="round" />
        <path d="M528 933c47 13 97 13 144 0" fill="none" stroke="#d58a91" strokeWidth="7" strokeLinecap="round" opacity="0.72" />
        <path d="M452 824c38 22 86 25 130 8" stroke="#a34756" strokeWidth="4" strokeLinecap="round" opacity="0.22" />
        <path d="M618 834c42 17 92 13 130-9" stroke="#a34756" strokeWidth="4" strokeLinecap="round" opacity="0.2" />
      </g>

      <g className="makeup-layer makeup-final" opacity="0">
        <path d="M386 640c56-134 136-195 214-195s158 61 214 195" fill="none" stroke="#fff8ef" strokeWidth="13" opacity="0.07" strokeLinecap="round" />
        <path d="M444 548c82-36 228-38 312-3" stroke="#f0d7a1" strokeWidth="7" opacity="0.11" strokeLinecap="round" />
        <circle cx="688" cy="646" r="9" fill="#fff8ef" opacity="0.26" filter="url(#beauty-soft-blur)" />
        <circle cx="790" cy="785" r="16" fill="#fff8ef" opacity="0.14" filter="url(#beauty-soft-blur)" />
        <path d="M536 930c38 9 88 9 126 0" stroke="#fff8ef" strokeWidth="4" opacity="0.16" strokeLinecap="round" />
      </g>

      <rect width="1200" height="1600" fill="#180f0e" opacity="0.04" />
    </svg>
  );
}
