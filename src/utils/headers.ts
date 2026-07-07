import VersionNumber from 'react-native-version-number';
import { Platform } from 'react-native';

export function defaultHeaders() {
  return {
    // CoopCycle's API is API Platform / Hydra. Without an explicit Accept
    // header, content negotiation falls back to plain `application/json`,
    // whose collection responses have no `hydra:member`/`hydra:totalItems`
    // wrapper — so every paginated fetch parses out as empty. Force JSON-LD.
    Accept: 'application/ld+json',
    'X-CoopCycle-App-Version': VersionNumber.appVersion,
    'User-Agent': `CoopCycle/${VersionNumber.appVersion} (${Platform.OS}/${Platform.Version}) ${VersionNumber.bundleIdentifier}/${VersionNumber.buildVersion}`,
  };
}
