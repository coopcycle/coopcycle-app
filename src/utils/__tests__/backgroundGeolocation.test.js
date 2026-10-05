// Custom (white-label) apps ship without the background-geolocation native
// module, and since v5 the package throws from module scope when it is absent.
// These tests pin the guard that keeps that throw from reaching the startup
// import graph — see src/utils/backgroundGeolocation.ts.

describe('backgroundGeolocation guard', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('when the native module is not linked (custom apps)', () => {
    beforeEach(() => {
      // A Proxy, not a spread: react-native's index exposes lazy getters, and
      // spreading it would eagerly evaluate every export.
      jest.doMock('react-native', () => {
        const actual = jest.requireActual('react-native');
        return new Proxy(actual, {
          get(target, prop) {
            if (prop === 'NativeModules') {
              return {};
            }
            if (prop === 'TurboModuleRegistry') {
              return { get: () => null };
            }
            return target[prop];
          },
        });
      });

      // Reproduces the real failure: evaluating the package throws.
      jest.doMock('react-native-background-geolocation', () => {
        evaluations += 1;
        throw new Error(
          '[react-native-background-geolocation] Native module "RNBackgroundGeolocation" not found. ' +
            'Make sure the library is properly installed and linked for your platform.',
        );
      });
    });

    it('does not throw when the guard module itself is imported', () => {
      expect(() => require('../backgroundGeolocation')).not.toThrow();
    });

    it('reports the plugin as unavailable', () => {
      const {
        isBackgroundGeolocationAvailable,
      } = require('../backgroundGeolocation');

      expect(isBackgroundGeolocationAvailable).toBe(false);
    });

    it('returns null instead of requiring the package', () => {
      const { getBackgroundGeolocation } = require('../backgroundGeolocation');

      expect(getBackgroundGeolocation()).toBeNull();
    });

    // NOTE: this does not reproduce the production crash on its own. Babel's
    // RN preset defers an import that is only used inside a function body, so
    // Address imported cleanly here even before the fix. The assertion below
    // that actually regressed is the getAddressFromCurrentPosition one.
    // Validating the startup import graph needs a real instance-flavor bundle.
    it('can be imported', () => {
      expect(() => require('../Address')).not.toThrow();
    });

    it('rejects getAddressFromCurrentPosition rather than crashing', async () => {
      const AddressUtils = require('../Address').default;

      await expect(
        AddressUtils.getAddressFromCurrentPosition(),
      ).rejects.toThrow('Background geolocation is not available');
    });
  });

  describe('when the native module is linked (official app)', () => {
    beforeEach(() => {
      jest.doMock('react-native', () => {
        const actual = jest.requireActual('react-native');
        return new Proxy(actual, {
          get(target, prop) {
            if (prop === 'NativeModules') {
              return { RNBackgroundGeolocation: {} };
            }
            if (prop === 'TurboModuleRegistry') {
              return { get: () => null };
            }
            return target[prop];
          },
        });
      });

      jest.doMock('react-native-background-geolocation', () => ({
        __esModule: true,
        default: { marker: 'real-module' },
      }));
    });

    it('reports the plugin as available', () => {
      const {
        isBackgroundGeolocationAvailable,
      } = require('../backgroundGeolocation');

      expect(isBackgroundGeolocationAvailable).toBe(true);
    });

    it('returns the package default export', () => {
      const { getBackgroundGeolocation } = require('../backgroundGeolocation');

      expect(getBackgroundGeolocation()).toEqual({ marker: 'real-module' });
    });
  });
});
