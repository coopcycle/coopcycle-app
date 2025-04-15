import VersionNumber from 'react-native-version-number';
import { Platform } from 'react-native';

export function defaultHeaders() {
  return {
    'X-CoopCycle-App-Version': VersionNumber.appVersion,
    'User-Agent': `CoopCycle/${VersionNumber.appVersion} (${Platform.OS}/${Platform.Version}) ${VersionNumber.bundleIdentifier}/${VersionNumber.buildVersion}`,
  };
}
