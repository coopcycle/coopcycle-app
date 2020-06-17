import BaseTracker from './BaseTracker'
import Countly from 'countly-sdk-react-native-bridge';

import { COUNTLY_SERVER_URL, COUNTLY_APP_KEY, COUNTLY_SALT } from 'react-native-dotenv'

function CountlyTracker() {
  this.userProperties = {}

  let deviceId = ''; // or use some string that identifies current app user

  // configure Countly parameters if needed
  Countly.enableParameterTamperingProtection(COUNTLY_SALT);

  // initialize
  Countly.init(COUNTLY_SERVER_URL, COUNTLY_APP_KEY, deviceId);

  // start session tracking
  Countly.start();
}

CountlyTracker.prototype = Object.create(BaseTracker.prototype);
CountlyTracker.prototype.constructor = CountlyTracker;

CountlyTracker.prototype.setCurrentScreen = function(screenName) {
  Countly.recordView(screenName);
}

CountlyTracker.prototype.logEvent = function(category, action, text, number) {
  let eventName;

  if (text != null) {
    eventName = `${category}_${action}_${text}`;
  } else {
    eventName = `${category}_${action}`;
  }

  let event = {'eventName': eventName};

  if (number != null) {
    event.eventCount = number
  }

  event.segments = this.userProperties

  Countly.sendEvent(event);
}

CountlyTracker.prototype.setUserProperty = function(name, value) {
  // there is no plugin on a backend to handle it
  // Countly.userData.setProperty(name, value);
  this.userProperties[name] = value
}

export default CountlyTracker
