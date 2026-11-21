import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeBlinkScaleY,
  computeNormalizedPointer,
  computeRobotLookTargets,
  dampValue,
} from './robotKinematics';

test('computeNormalizedPointer centers and clamps pointer coordinates relative to rect', () => {
  const rect = {left: 100, top: 200, width: 500, height: 400};
  const center = computeNormalizedPointer(350, 376, 1440, 900, rect);
  assert.ok(Math.abs(center.nx) < 1e-6);
  assert.ok(Math.abs(center.ny) < 1e-6);

  const farRightTop = computeNormalizedPointer(2500, -500, 1440, 900, rect);
  assert.equal(farRightTop.nx, 1);
  assert.equal(farRightTop.ny, 1);

  const farLeftBottom = computeNormalizedPointer(-500, 2000, 1440, 900, rect);
  assert.equal(farLeftBottom.nx, -1);
  assert.equal(farLeftBottom.ny, -1);
});

test('computeRobotLookTargets maps +X right and +Y up to right-handed yaw/pitch signs', () => {
  const rightUp = computeRobotLookTargets(1, 1, false);
  assert.ok(rightUp.headYaw > 0, 'Looking right uses positive rotation.y');
  assert.ok(rightUp.torsoYaw > 0 && rightUp.torsoYaw < rightUp.headYaw);
  assert.ok(rightUp.headPitch < 0, 'Looking up uses negative rotation.x');
  assert.ok(rightUp.eyeOffsetX > 0 && rightUp.eyeOffsetY > 0);

  const hovered = computeRobotLookTargets(1, 1, true);
  assert.ok(hovered.headYaw > rightUp.headYaw, 'Hovered state increases tracking range');
});

test('dampValue approaches target smoothly and monotonically', () => {
  const step1 = dampValue(0, 1, 8, 1 / 60);
  const step2 = dampValue(step1, 1, 8, 1 / 60);
  assert.ok(step1 > 0 && step1 < 1);
  assert.ok(step2 > step1 && step2 < 1);
});

test('computeBlinkScaleY stays open most of cycle and closes smoothly near end', () => {
  assert.equal(computeBlinkScaleY(0.25), 1);
  assert.equal(computeBlinkScaleY(0.8), 1);
  const midBlink = computeBlinkScaleY(0.965);
  assert.ok(midBlink < 0.2 && midBlink >= 0.08);
});
