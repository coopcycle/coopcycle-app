const {
  withNativeWind: withNativeWind
} = require("nativewind/metro");

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = withNativeWind(mergeConfig(getDefaultConfig(__dirname), config), { input: './global.css' });
