import { Linking } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

const inAppBrowserOptions = {
  dismissButtonStyle: 'cancel',
};

const isWebUrl = (url: string) => /^https?:\/\//i.test(url);

/**
 * Opens a web url with the in-app browser when available,
 * and falls back to the system handler (also used for tel:, mailto:, …)
 */
export const openUrl = async (url: string) => {
  if (isWebUrl(url)) {
    try {
      if (await InAppBrowser.isAvailable()) {
        InAppBrowser.close();
        await InAppBrowser.open(url, inAppBrowserOptions);
        return;
      }
    } catch {
      // fall through to Linking
    }
  }

  try {
    await Linking.openURL(url);
  } catch (e) {
    console.log(`Could not open url ${url}`, e);
  }
};
