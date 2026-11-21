import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMagneticOffset,
  EDITORIAL_EASE,
  getMarqueeDurationSeconds,
  getStaggerDelay,
} from './motionHelpers';

test('EDITORIAL_EASE matches custom cubic-bezier [0.22, 1, 0.36, 1]', () => {
  assert.deepEqual(EDITORIAL_EASE, [0.22, 1, 0.36, 1]);
});

test('calculateMagneticOffset returns zero when disabled or rect has zero dimensions', () => {
  const rect = {left: 100, top: 100, width: 200, height: 50};
  assert.deepEqual(calculateMagneticOffset(220, 130, rect, false), {x: 0, y: 0});
  assert.deepEqual(
    calculateMagneticOffset(220, 130, {left: 0, top: 0, width: 0, height: 0}, true),
    {x: 0, y: 0}
  );
});

test('calculateMagneticOffset scales and clamps displacement cleanly around element center', () => {
  const rect = {left: 100, top: 100, width: 200, height: 50};
  // Center is (200, 125)
  assert.deepEqual(calculateMagneticOffset(200, 125, rect, true), {x: 0, y: 0});
  assert.deepEqual(calculateMagneticOffset(220, 135, rect, true, 0.25, 10), {x: 5, y: 2.5});
  // Clamps to maxOffset
  assert.deepEqual(calculateMagneticOffset(400, 300, rect, true, 0.5, 8), {x: 8, y: 8});
  assert.deepEqual(calculateMagneticOffset(0, 0, rect, true, 0.5, 8), {x: -8, y: -8});
});

test('getStaggerDelay computes accurate editorial beats', () => {
  assert.equal(getStaggerDelay(0, 0.12, 0), 0);
  assert.equal(getStaggerDelay(1, 0.12, 0.08), 0.2);
  assert.equal(getStaggerDelay(2, 0.12, 0.08), 0.32);
  assert.equal(getStaggerDelay(-1, 0.12, 0.1), 0.1);
});

test('getMarqueeDurationSeconds returns 24s on mobile and 30s on desktop', () => {
  assert.equal(getMarqueeDurationSeconds(390), 24);
  assert.equal(getMarqueeDurationSeconds(767), 24);
  assert.equal(getMarqueeDurationSeconds(768), 30);
  assert.equal(getMarqueeDurationSeconds(1440), 30);
});
