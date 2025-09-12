import { getAnalytics, setUserProperty, logEvent } from '@react-native-firebase/analytics';
import BaseTracker from './BaseTracker';

function FirebaseTracker() {}
FirebaseTracker.prototype = Object.create(BaseTracker.prototype);
FirebaseTracker.prototype.constructor = FirebaseTracker;

FirebaseTracker.prototype.setCurrentScreen = function (screenName) {
  // https://github.com/invertase/react-native-firebase/issues/8609
  logEvent(getAnalytics(), 'screen_view', {
    screen_class: screenName,
    screen_name: screenName,
  });
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

  logEvent(getAnalytics(), event, params);
};

FirebaseTracker.prototype.setUserProperty = function (name, value) {
  setUserProperty(getAnalytics(), name, value);
};

FirebaseTracker.prototype.init = function () {};

export default FirebaseTracker;
