import { useColorScheme } from 'nativewind';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import Color from 'colorjs.io';
import { useSelector } from 'react-redux';
import { primaryColor } from './common';
import { selectServerTheme } from '../redux/App/selectors';

export const useColorModeValue = <T>(lightValue: T, darkValue: T): T => {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? darkValue : lightValue;
};

export const useBackgroundColor = () => {
  return useColorModeValue(
    DefaultTheme.colors.background,
    DarkTheme.colors.background,
  );
};

const CONTRAST_TARGET = 4.5;
const LIGHTNESS_STEP = 0.05;
// 1 / LIGHTNESS_STEP walks the whole 0..1 ramp; the extra one is slack for the
// first partial step.
const MAX_STEPS = Math.ceil(1 / LIGHTNESS_STEP) + 1;

/**
 * Walks `c` towards the far end of the lightness ramp until it reads at 4.5:1
 * against `background`, and returns the first shade that does.
 *
 * The walk steps OKLCH lightness *additively*, and is capped. `lighten()` and
 * `darken()` scale lightness instead — `l *= 1 + amount` — which makes L = 0 a
 * fixed point: pure black never gets any lighter, so an instance whose brand
 * colour is `#000000` sent the old `while (contrast < 4.5)` loop spinning for
 * good on a dark background. That froze the JS thread on the first render
 * after `GET /api/settings`, which looked like the app hanging on connect.
 *
 * A colour that cannot reach the target even at the end of the ramp comes back
 * as the closest we got, which is the best this can do without picking a
 * different hue for the instance.
 */
function checkContrast(c, background, theme) {
  const color = new Color(c);
  let contrast = color.contrast(background, 'WCAG21');

  for (let step = 0; step < MAX_STEPS && contrast < CONTRAST_TARGET; step++) {
    const lightness = color.oklch.l;
    const next =
      theme === 'dark'
        ? Math.min(1, lightness + LIGHTNESS_STEP)
        : Math.max(0, lightness - LIGHTNESS_STEP);

    // Already at the end of the ramp: nothing left to trade for contrast.
    if (next === lightness) {
      break;
    }

    color.oklch.l = next;
    contrast = color.contrast(background, 'WCAG21');
  }

  return color.toString({ format: 'hex' });
}

const primaryLight = checkContrast(primaryColor, '#FFFFFF', 'light');
const primaryDark = checkContrast(primaryColor, '#201E1E', 'dark');

export const usePrimaryColor = () => {
  const serverTheme = useSelector(selectServerTheme);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (serverTheme?.primary) {
    const bg = isDark ? '#201E1E' : '#FFFFFF';
    return checkContrast(serverTheme.primary, bg, colorScheme || 'light');
  }

  return isDark ? primaryDark : primaryLight;
};

export const usePrimaryContentColor = () => {
  const serverTheme = useSelector(selectServerTheme);
  if (serverTheme?.['primary-content']) {
    return serverTheme['primary-content'];
  }
  return '#FFFFFF';
};

export const useSecondaryColor = () => {
  const serverTheme = useSelector(selectServerTheme);
  const fallback = useColorModeValue('rgb(217 217 219)', 'rgb(63 64 64)');
  return serverTheme?.secondary ?? fallback;
};

export const useSecondaryContentColor = () => {
  const serverTheme = useSelector(selectServerTheme);
  const fallback = useColorModeValue('#000000', '#FFFFFF');
  return serverTheme?.['secondary-content'] ?? fallback;
};

export const useIconColor = () => {
  return useColorModeValue('#424242', '#B0BEC5');
};
