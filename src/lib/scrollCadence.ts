export const MOBILE_SCROLL_BEAT = 0.82;
export const TABLET_SCROLL_BEAT = 0.9;
export const MOBILE_SCRUB = 0.72;

export function stableSceneHeight() {
  if (typeof window === "undefined") return 0;

  const sceneVh = window.getComputedStyle(document.documentElement).getPropertyValue("--scene-vh");
  const parsed = Number.parseFloat(sceneVh);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : window.innerHeight;
}

export function viewportScrollDistance(beats = 1, multiplier = MOBILE_SCROLL_BEAT) {
  return () => `+=${Math.round(stableSceneHeight() * beats * multiplier)}`;
}
