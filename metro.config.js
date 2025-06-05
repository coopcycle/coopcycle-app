const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultResolver = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...defaultResolver.resolver,
    assetExts: defaultResolver.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultResolver.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultResolver, config);
