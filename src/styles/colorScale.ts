import Color from 'colorjs.io';

const STOPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Lightness targets for each stop, with 500 = base color lightness.
// Values are relative offsets from base lightness, clamped to [0, 1].
const LIGHT_OFFSETS: Record<number, number> = {
  0: 0.42,
  50: 0.37,
  100: 0.31,
  200: 0.24,
  300: 0.16,
  400: 0.08,
  500: 0,
  600: -0.07,
  700: -0.14,
  800: -0.21,
  900: -0.27,
  950: -0.31,
};

function toRgbString(color: Color): string {
  const srgb = color.to('srgb');
  const r = Math.round(Math.max(0, Math.min(1, srgb.coords[0])) * 255);
  const g = Math.round(Math.max(0, Math.min(1, srgb.coords[1])) * 255);
  const b = Math.round(Math.max(0, Math.min(1, srgb.coords[2])) * 255);
  return `${r} ${g} ${b}`;
}

/**
 * In dark mode the ramp is anchored no darker than this.
 *
 * The ramp offsets from an anchor, and the brand colour's own lightness only
 * works as that anchor while the brand colour sits somewhere in the middle of
 * the range. In dark mode the primary family is a *foreground* family —
 * compare the static config, whose dark primary ramp runs 166 → 253 — but an
 * instance's brand colour is picked against a light background. One that is
 * near-black (`#0a090a`, oklch L 0.06) produced a dark ramp topping out at
 * L 0.37, so `primary-800` came out at rgb(60 58 60): unreadable on a dark
 * surface, and the reason task markers were invisible for that instance.
 *
 * The floor lifts only those ramps: a brand colour already light enough to
 * work on a dark surface is left exactly as it is.
 */
const DARK_ANCHOR_MIN = 0.7;

function buildRamp(hex: string, invert: boolean): Record<string, string> {
  const base = new Color(hex).to('oklch');
  const anchor = invert
    ? Math.max(DARK_ANCHOR_MIN, base.coords[0])
    : base.coords[0];

  const result: Record<string, string> = {};

  for (const stop of STOPS) {
    const offset = invert ? -LIGHT_OFFSETS[stop] : LIGHT_OFFSETS[stop];
    const lightness = Math.max(0.05, Math.min(0.98, anchor + offset));

    const stepped = new Color('oklch', [
      lightness,
      base.coords[1],
      base.coords[2],
    ]);

    result[String(stop)] = toRgbString(stepped);
  }

  return result;
}

export function buildColorScale(hex: string): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  return {
    light: buildRamp(hex, false),
    dark: buildRamp(hex, true),
  };
}
