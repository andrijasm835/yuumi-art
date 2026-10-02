import { useId, type SVGProps } from "react";

const transformationStages = {
  natural: "/yummi/transformation-natural-v3.jpg",
  eyes: "/yummi/transformation-eye-v3.jpg",
  color: "/yummi/transformation-color-v3.jpg",
  final: "/yummi/transformation-final-v3.jpg",
};

export function BeautyFace(props: SVGProps<SVGSVGElement>) {
  const rawId = useId().replace(/:/g, "");
  const ids = {
    eyeMask: `eye-mask-${rawId}`,
    colorMask: `color-mask-${rawId}`,
    finalMask: `final-mask-${rawId}`,
    softEdge: `soft-edge-${rawId}`,
  };

  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Beauty transformacija kroz pet realnih makeup faza"
      {...props}
    >
      <defs>
        <filter id={ids.softEdge} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>

        <mask id={ids.eyeMask} maskUnits="userSpaceOnUse">
          <rect width="1920" height="1080" fill="black" />
          <ellipse
            className="reveal-shape reveal-eye-left"
            cx="882"
            cy="454"
            rx="300"
            ry="430"
            fill="white"
            filter={`url(#${ids.softEdge})`}
            style={{ transformBox: "fill-box", transformOrigin: "100% 50%", transform: "scaleX(0)" }}
          />
          <ellipse
            className="reveal-shape reveal-eye-right"
            cx="1038"
            cy="454"
            rx="300"
            ry="430"
            fill="white"
            filter={`url(#${ids.softEdge})`}
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%", transform: "scaleX(0)" }}
          />
        </mask>

        <mask id={ids.colorMask} maskUnits="userSpaceOnUse">
          <rect width="1920" height="1080" fill="black" />
          <ellipse className="reveal-shape reveal-cheek-left" cx="845" cy="500" rx="0" ry="0" fill="white" filter={`url(#${ids.softEdge})`} />
          <ellipse className="reveal-shape reveal-cheek-right" cx="1076" cy="500" rx="0" ry="0" fill="white" filter={`url(#${ids.softEdge})`} />
          <ellipse className="reveal-shape reveal-lips" cx="960" cy="590" rx="0" ry="0" fill="white" filter={`url(#${ids.softEdge})`} />
        </mask>

        <mask id={ids.finalMask} maskUnits="userSpaceOnUse">
          <rect width="1920" height="1080" fill="black" />
          <rect
            className="reveal-shape reveal-final"
            x="600"
            y="40"
            width="720"
            height="1000"
            rx="320"
            fill="white"
            filter={`url(#${ids.softEdge})`}
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%", transform: "scaleY(0)" }}
          />
        </mask>
      </defs>

      <image className="stage-image stage-natural" href={transformationStages.natural} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" />
      <image className="stage-image stage-eyes" href={transformationStages.eyes} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" opacity="0" />
      <image className="stage-image stage-color" href={transformationStages.color} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" opacity="0" />
      <image className="stage-image stage-final" href={transformationStages.final} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" opacity="0" />
    </svg>
  );
}
