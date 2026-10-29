import assert from "node:assert/strict";
import test from "node:test";
import { contentScrollDistance, shouldResizeScenes } from "./scrollCadence";

test("mobile address bar and keyboard height changes do not resize pinned scenes", () => {
  const initial = { width: 390, height: 740 };
  for (const height of [640, 844, 400]) {
    assert.equal(shouldResizeScenes(initial, { width: 390, height }, true), false);
  }
});

test("rotation and split-screen width changes recalculate the scenes", () => {
  assert.equal(shouldResizeScenes({ width: 390, height: 740 }, { width: 844, height: 390 }, true), true);
  assert.equal(shouldResizeScenes({ width: 820, height: 1180 }, { width: 600, height: 1180 }, true), true);
});

test("desktop height changes still recalculate scenes", () => {
  assert.equal(shouldResizeScenes({ width: 1440, height: 900 }, { width: 1440, height: 700 }, false), true);
  assert.equal(shouldResizeScenes({ width: 1440, height: 900 }, { width: 1440, height: 900 }, false), false);
});

test("galleries consume one pixel of scroll per pixel of content, including short and empty tracks", () => {
  assert.equal(contentScrollDistance(2340 - 390), "+=1950");
  assert.equal(contentScrollDistance(8 * 544), "+=4352");
  assert.equal(contentScrollDistance(0), "+=1");
  assert.equal(contentScrollDistance(-30), "+=1");
});
