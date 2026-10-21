import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Color from 'colorjs.io';

const mockColorScheme = { current: 'light' };
jest.mock('nativewind', () => ({
  useColorScheme: () => ({ colorScheme: mockColorScheme.current }),
  vars: (v: Record<string, string>) => v,
}));

import { usePrimaryColor } from '../theme';

// The background `usePrimaryColor` checks against in each mode.
const BACKGROUND = { light: '#FFFFFF', dark: '#201E1E' };

function wrapperFor(theme: object | null) {
  const store = createStore(() => ({ app: { settings: { theme } } }));
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

function primaryFor(theme: object | null, mode: 'light' | 'dark') {
  mockColorScheme.current = mode;
  return renderHook(() => usePrimaryColor(), { wrapper: wrapperFor(theme) })
    .result.current;
}

describe('usePrimaryColor', () => {
  // A brand colour of pure black used to hang the app: `darken`/`lighten`
  // scale OKLCH lightness, so L = 0 is a fixed point and the contrast walk
  // never reached its target. The JS thread froze on the first render after
  // the settings came in, which read as the app hanging on connect.
  it.each(['light', 'dark'] as const)(
    'returns a readable colour for a pure black brand colour in %s mode',
    mode => {
      const primary = primaryFor({ primary: '#000000' }, mode);

      expect(new Color(primary).contrast(BACKGROUND[mode], 'WCAG21')).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('leaves a brand colour that already reads well alone', () => {
    expect(primaryFor({ primary: '#c2c2c2' }, 'dark')).toBe('#c2c2c2');
  });

  it('falls back to the built-in colour when the instance has no theme', () => {
    // Instances that never set one serve `theme: []`.
    expect(primaryFor([] as unknown as object, 'light')).toBeTruthy();
  });
});
