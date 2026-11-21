import test from 'node:test';
import assert from 'node:assert/strict';
import {getMacCursorHotspot, resolveMacCursorVariant} from './appleCursorHelpers';

test('resolveMacCursorVariant maps interactive, text, and default regions to macOS cursors', () => {
  assert.equal(resolveMacCursorVariant({isInteractive: true, tagName: 'P'}), 'pointer');
  assert.equal(resolveMacCursorVariant({isInteractive: false, tagName: 'H1'}), 'text');
  assert.equal(
    resolveMacCursorVariant({isInteractive: false, tagName: 'DIV', computedCursor: 'text'}),
    'text',
  );
  assert.equal(resolveMacCursorVariant({isInteractive: false, tagName: 'DIV'}), 'arrow');
});

test('getMacCursorHotspot aligns tip/hotspot accurately for arrow, pointer, and text SVGs', () => {
  assert.deepEqual(getMacCursorHotspot('arrow'), {offsetX: -5, offsetY: -3});
  assert.deepEqual(getMacCursorHotspot('pointer'), {offsetX: -10, offsetY: -3});
  assert.deepEqual(getMacCursorHotspot('text'), {offsetX: -14, offsetY: -14});
});
