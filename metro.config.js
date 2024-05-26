const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const { mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getSentryExpoConfig(__dirname), config);
