import { vars } from 'nativewind';
import { config as staticConfig } from '@/components/ui/gluestack-ui-provider/config';
import { buildColorScale } from './colorScale';

type ServerTheme = {
  primary: string;
  'primary-content': string;
  secondary: string;
  'secondary-content': string;
};

const SCALE_STOPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function mapScaleToVars(
  role: string,
  scale: Record<string, string>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const stop of SCALE_STOPS) {
    result[`--color-${role}-${stop}`] = scale[String(stop)];
  }
  return result;
}

/**
 * Only the `primary` and `secondary` families are returned here. The rest of
 * the palette comes from the static config, which `GluestackUIProvider` puts
 * earlier in the same style array — these override it by position.
 *
 * Spreading `staticConfig` in as a base would not work: `vars()` returns an
 * opaque marker object and keeps the variables in a side-table keyed by its
 * identity, so the spread yields nothing.
 */
export function buildThemeConfig(theme: ServerTheme | null): {
  light: ReturnType<typeof vars>;
  dark: ReturnType<typeof vars>;
} {
  if (!theme) return staticConfig;

  const primaryScale = theme.primary ? buildColorScale(theme.primary) : null;
  const secondaryScale = theme.secondary ? buildColorScale(theme.secondary) : null;

  return {
    light: vars({
      ...(primaryScale ? mapScaleToVars('primary', primaryScale.light) : {}),
      ...(secondaryScale ? mapScaleToVars('secondary', secondaryScale.light) : {}),
    }),
    dark: vars({
      ...(primaryScale ? mapScaleToVars('primary', primaryScale.dark) : {}),
      ...(secondaryScale ? mapScaleToVars('secondary', secondaryScale.dark) : {}),
    }),
  };
}
