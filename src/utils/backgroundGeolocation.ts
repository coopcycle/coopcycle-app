'use strict';

import { NativeModules, TurboModuleRegistry } from 'react-native';

/**
 * Custom (white-label) apps are built with `react-native-background-geolocation`
 * auto-linking disabled on Android — see the `DEFAULT_SERVER` branch in
 * `react-native.config.js` — so the native module is deliberately absent there.
 *
 * Since v5 the package resolves the native module at *module scope*
 * (`export const RNBackgroundGeolocation = getNativeBGGeo();` in
 * `src/NativeModule.js`) and throws when it cannot be found. A static
 * `import` therefore throws while Metro is still evaluating the bundle, which
 * React Native reports as `[runtime not ready]` and turns into a SIGABRT before
 * anything renders — and before Sentry can flush.
 *
 * So the package must never be imported unconditionally. Probe first, then
 * `require` only once the native module is known to be there.
 */

// Mirrors getNativeBGGeo() in the package: TurboModule first, classic bridge second.
const isLinked = (() => {
  if (TurboModuleRegistry && typeof TurboModuleRegistry.get === 'function') {
    try {
      if (TurboModuleRegistry.get('RNBackgroundGeolocation')) {
        return true;
      }
    } catch (e) {
      // Fall through to the classic bridge, as the package does.
    }
  }

  return !!(NativeModules && NativeModules.RNBackgroundGeolocation);
})();

export const isBackgroundGeolocationAvailable = isLinked;

// Type-only, so it is erased at compile time and emits no require().
type BackgroundGeolocationModule =
  typeof import('react-native-background-geolocation').default;

/**
 * The `react-native-background-geolocation` default export, or `null` in builds
 * where the native module is not linked. Callers must handle `null`.
 */
export function getBackgroundGeolocation(): BackgroundGeolocationModule | null {
  if (!isLinked) {
    return null;
  }

  return require('react-native-background-geolocation').default;
}
