import Countly from 'countly-sdk-react-native-bridge';
import { Platform } from 'react-native';
import BaseTracker from './BaseTracker';

import Config from 'react-native-config';

function CountlyTracker() {
  this.userProperties = {};
}

CountlyTracker.prototype = Object.create(BaseTracker.prototype);
CountlyTracker.prototype.constructor = CountlyTracker;

CountlyTracker.prototype.setCurrentScreen = function (screenName) {
  if (Platform.OS === 'ios') {
    return;
  }

  Countly.isInitialized().then(initialized => {
    if (!initialized) {
      return;
    }

    Countly.recordView(screenName);
  });
};

CountlyTracker.prototype.logEvent = function (category, action, text, number) {
  if (Platform.OS === 'ios') {
    return;
  }

  Countly.isInitialized().then(initialized => {
    if (!initialized) {
      return;
    }

    let eventName;

    if (text != null) {
      eventName = `${category}_${action}_${text}`;
    } else {
      eventName = `${category}_${action}`;
    }

    let event = { eventName: eventName };

    if (number != null) {
      event.eventCount = number;
    }

    event.segments = this.userProperties;

    Countly.sendEvent(event);
  });
};

CountlyTracker.prototype.setUserProperty = function (name, value) {
  if (Platform.OS === 'ios') {
    return;
  }

  // there is no plugin on a backend to handle it
  // Countly.userData.setProperty(name, value);
  this.userProperties[name] = value;
};

CountlyTracker.prototype.init = function () {
  let deviceId = ''; // or use some string that identifies current app user

  if (Platform.OS === 'ios') {
    return;
  }

  try {
    // configure Countly parameters if needed
    Countly.enableParameterTamperingProtection(Config.COUNTLY_SALT);

    // initialize
    Countly.init(Config.COUNTLY_SERVER_URL, Config.COUNTLY_APP_KEY, deviceId)
      .then(() => {
        // start session tracking
        Countly.start();
      })
      .catch(e => console.log(e));
  } catch (e) {
    console.log(e);
  }
};

export default CountlyTracker;
