import Color from 'colorjs.io';

import { buildColorScale } from '../colorScale';

// The surfaces the primary ramp is read against, from the static gluestack
// config: `background-0` in each mode.
const DARK_SURFACE = 'rgb(18 18 18)';
const LIGHT_SURFACE = 'rgb(255 255 255)';

// A solid button paints `primary-500` and writes `typography-0` on top, so
// stop 500 is read against the label, not against the page. From the static
// gluestack config, `typography-0` in each mode.
const DARK_LABEL = 'rgb(23 23 23)';
const LIGHT_LABEL = 'rgb(254 254 255)';

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

    // `primary-500` is the solid button background. A near-black brand colour
    // anchored it at rgb(10 9 10) on a rgb(18 18 18) page: the invisible
    // checkout buttons of issue #2123.
    it.each([
      ['near-black', NEAR_BLACK],
      ['light beige', LIGHT_BEIGE],
      ['orange', ORANGE],
    ])('gives %s a solid button that reads on a dark surface', (_label, hex) => {
      const { dark } = buildColorScale(hex);

      expect(contrast(dark['500'], DARK_LABEL)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(dark['500'], DARK_SURFACE)).toBeGreaterThanOrEqual(3);
    });
  });

  describe('light mode', () => {
    it('leaves a brand colour that already works untouched', () => {
      // oklch L of #0a090a is below the ceiling, so stop 500 is the brand colour
      expect(buildColorScale(NEAR_BLACK).light['500']).toEqual('10 9 10');
    });

    // The mirror of the dark-mode case: here the label is near-white, so a
    // brand colour that is light in its own right paints a white-on-white
    // button. #d9ceb4 anchored stop 500 at rgb(217 206 180) — 1.55:1.
    it.each([
      ['near-black', NEAR_BLACK],
      ['light beige', LIGHT_BEIGE],
      ['orange', ORANGE],
    ])(
      'gives %s a solid button that reads on a light surface',
      (_label, hex) => {
        const { light } = buildColorScale(hex);

        expect(contrast(light['500'], LIGHT_LABEL)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(light['500'], LIGHT_SURFACE)).toBeGreaterThanOrEqual(3);
      },
    );

    it('keeps a dark brand colour readable on a light surface', () => {
      const { light } = buildColorScale(NEAR_BLACK);

      expect(contrast(light['800'], LIGHT_SURFACE)).toBeGreaterThanOrEqual(4.5);
    });
  });
});
