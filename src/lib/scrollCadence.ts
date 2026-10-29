// A mobile timeline unit spans one stable viewport; native momentum owns smoothing.
export const MOBILE_SCROLL_BEAT = 1;
export const TABLET_SCROLL_BEAT = 0.9;
export const MOBILE_SCRUB = true;

export function stableSceneHeight() {
  if (typeof window === "undefined") return 0;

  const sceneVh = window.getComputedStyle(document.documentElement).getPropertyValue("--scene-vh");
  const parsed = Number.parseFloat(sceneVh);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : window.innerHeight;
}

export function viewportScrollDistance(beats = 1, multiplier = MOBILE_SCROLL_BEAT) {
  return () => contentScrollDistance(stableSceneHeight() * beats * multiplier);
}

type ViewportSize = { width: number; height: number };

export function shouldResizeScenes(previous: ViewportSize, next: ViewportSize, nativeScroll: boolean) {
  return previous.width !== next.width || (!nativeScroll && previous.height !== next.height);
}

export function contentScrollDistance(distance: number) {
  return `+=${Math.max(1, Math.round(distance))}`;
}
