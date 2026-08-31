import Color from 'colorjs.io';

import { buildColorScale } from '../colorScale';

// The surfaces the primary ramp is read against, from the static gluestack
// config: `background-0` in each mode.
const DARK_SURFACE = 'rgb(18 18 18)';
const LIGHT_SURFACE = 'rgb(255 255 255)';

const contrast = (rampValue, surface) =>
  new Color(`rgb(${rampValue})`).contrast(surface, 'WCAG21');

describe('buildColorScale', () => {
  // Real instance brand colours, from GET /api/settings
  const NEAR_BLACK = '#0a090a'; // lcr
  const LIGHT_BEIGE = '#d9ceb4'; // corbo
  const ORANGE = '#e14113'; // sicklo

  describe('dark mode', () => {
    // `primary-700`/`800` are foreground tokens in dark mode. Anchoring the
    // ramp on the brand colour left them unreadable for instances whose brand
    // colour is dark — which is what made task markers invisible.
    it.each([
      ['near-black', NEAR_BLACK],
      ['light beige', LIGHT_BEIGE],
      ['orange', ORANGE],
    ])('gives %s a legible foreground on a dark surface', (_label, hex) => {
      const { dark } = buildColorScale(hex);

      expect(contrast(dark['700'], DARK_SURFACE)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(dark['800'], DARK_SURFACE)).toBeGreaterThanOrEqual(4.5);
    });

    it('leaves a brand colour that already works untouched', () => {
      const { dark } = buildColorScale(LIGHT_BEIGE);

      // oklch L of #d9ceb4 is above the floor, so stop 500 is the brand colour
      expect(dark['500']).toEqual('217 206 180');
    });
  });

  describe('light mode', () => {
    it.each([
      ['near-black', NEAR_BLACK, '10 9 10'],
      ['light beige', LIGHT_BEIGE, '217 206 180'],
      ['orange', ORANGE, '225 65 19'],
    ])('keeps %s as stop 500', (_label, hex, expected) => {
      expect(buildColorScale(hex).light['500']).toEqual(expected);
    });

    it('keeps a dark brand colour readable on a light surface', () => {
      const { light } = buildColorScale(NEAR_BLACK);

      expect(contrast(light['800'], LIGHT_SURFACE)).toBeGreaterThanOrEqual(4.5);
    });
  });
});
