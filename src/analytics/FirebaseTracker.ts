import { getAnalytics, setUserProperty, logEvent } from '@react-native-firebase/analytics';
import BaseTracker from './BaseTracker';

/**
 * Firebase Analytics relies on Google Play Services, which are absent on
 * de-Googled Android builds (CalyxOS, /e/OS, LineageOS...). Analytics is
 * best-effort: never let a failed measurement call break navigation or a user
 * action, since setCurrentScreen runs on every route change.
 * @see https://github.com/coopcycle/coopcycle-app/issues/2113
 */
function tryTrack(fn: () => unknown) {
  const onError = (e: unknown) => console.log('Analytics unavailable:', e);

  try {
    // The Firebase calls below are async, so a missing measurement service
    // surfaces as a rejection rather than a throw; handle both.
    Promise.resolve(fn()).catch(onError);
  } catch (e) {
    onError(e);
  }
}

function FirebaseTracker() {}
FirebaseTracker.prototype = Object.create(BaseTracker.prototype);
FirebaseTracker.prototype.constructor = FirebaseTracker;

FirebaseTracker.prototype.setCurrentScreen = function (screenName) {
  // https://github.com/invertase/react-native-firebase/issues/8609
  tryTrack(() =>
    logEvent(getAnalytics(), 'screen_view', {
      screen_class: screenName,
      screen_name: screenName,
    }),
  );
};

FirebaseTracker.prototype.logEvent = function (category, action, text, number) {
  let event = category + '_' + action;

  let params = {};

  if (text != null) {
    params.text = text;
  }

  if (number != null) {
    params.number = number;
  }

  tryTrack(() => logEvent(getAnalytics(), event, params));
};

FirebaseTracker.prototype.setUserProperty = function (name, value) {
  tryTrack(() => setUserProperty(getAnalytics(), name, value));
};

FirebaseTracker.prototype.init = function () {};

export default FirebaseTracker;
