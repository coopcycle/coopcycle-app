import VersionNumber from 'react-native-version-number';

export function defaultHeaders() {
  return {
    'X-Application-Version':
      VersionNumber.bundleIdentifier +
      '@' +
      VersionNumber.appVersion +
      ' (' +
      VersionNumber.buildVersion +
      ')',
    'X-CoopCycle-App-Version': VersionNumber.appVersion,
  };
}
