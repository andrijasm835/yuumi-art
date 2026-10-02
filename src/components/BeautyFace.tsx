import { useId, type SVGProps } from "react";

const transformationStages = {
  natural: "/yummi/transformation-natural.jpg",
  skin: "/yummi/transformation-skin.jpg",
  eyes: "/yummi/transformation-eyes.jpg",
  color: "/yummi/transformation-color.jpg",
  final: "/yummi/transformation-final.jpg",
};

export function BeautyFace(props: SVGProps<SVGSVGElement>) {
  const rawId = useId().replace(/:/g, "");
  const ids = {
    skinMask: `skin-mask-${rawId}`,
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

        <mask id={ids.skinMask} maskUnits="userSpaceOnUse">
          <rect width="1920" height="1080" fill="black" />
          <ellipse
            className="reveal-shape reveal-skin"
            cx="1112"
            cy="414"
            rx="310"
            ry="360"
            fill="white"
            filter={`url(#${ids.softEdge})`}
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%", transform: "scaleX(0)" }}
          />
        </mask>

        <mask id={ids.eyeMask} maskUnits="userSpaceOnUse">
          <rect width="1920" height="1080" fill="black" />
          <ellipse
            className="reveal-shape reveal-eye-left"
            cx="1012"
            cy="318"
            rx="150"
            ry="72"
            fill="white"
            filter={`url(#${ids.softEdge})`}
            style={{ transformBox: "fill-box", transformOrigin: "100% 50%", transform: "scaleX(0)" }}
          />
          <ellipse
            className="reveal-shape reveal-eye-right"
            cx="1204"
            cy="318"
            rx="150"
            ry="72"
            fill="white"
            filter={`url(#${ids.softEdge})`}
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%", transform: "scaleX(0)" }}
          />
        </mask>

        <mask id={ids.colorMask} maskUnits="userSpaceOnUse">
          <rect width="1920" height="1080" fill="black" />
          <ellipse className="reveal-shape reveal-cheek-left" cx="995" cy="472" rx="0" ry="0" fill="white" filter={`url(#${ids.softEdge})`} />
          <ellipse className="reveal-shape reveal-cheek-right" cx="1240" cy="468" rx="0" ry="0" fill="white" filter={`url(#${ids.softEdge})`} />
          <ellipse className="reveal-shape reveal-lips" cx="1110" cy="570" rx="0" ry="0" fill="white" filter={`url(#${ids.softEdge})`} />
        </mask>

        <mask id={ids.finalMask} maskUnits="userSpaceOnUse">
          <rect width="1920" height="1080" fill="black" />
          <rect
            className="reveal-shape reveal-final"
            x="710"
            y="80"
            width="820"
            height="910"
            rx="360"
            fill="white"
            filter={`url(#${ids.softEdge})`}
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%", transform: "scaleY(0)" }}
          />
        </mask>
      </defs>

      <image className="stage-image stage-natural" href={transformationStages.natural} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" />
      <image className="stage-image stage-skin" href={transformationStages.skin} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" mask={`url(#${ids.skinMask})`} opacity="0" />
      <image className="stage-image stage-eyes" href={transformationStages.eyes} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" mask={`url(#${ids.eyeMask})`} opacity="0" />
      <image className="stage-image stage-color" href={transformationStages.color} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" mask={`url(#${ids.colorMask})`} opacity="0" />
      <image className="stage-image stage-final" href={transformationStages.final} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" mask={`url(#${ids.finalMask})`} opacity="0" />
    </svg>
  );
}
