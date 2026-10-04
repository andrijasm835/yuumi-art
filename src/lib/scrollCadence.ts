export const MOBILE_SCROLL_BEAT = 0.82;
export const TABLET_SCROLL_BEAT = 0.9;
export const MOBILE_SCRUB = 0.72;

export function viewportScrollDistance(beats = 1, multiplier = MOBILE_SCROLL_BEAT) {
  return () => `+=${Math.round(window.innerHeight * beats * multiplier)}`;
}
