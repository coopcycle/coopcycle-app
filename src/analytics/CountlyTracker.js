import BaseTracker from './BaseTracker'
import Countly from 'countly-sdk-react-native-bridge';

function CountlyTracker() {
  this.userProperties = {}

  // initialize
  let serverURL = '';
  let appKey = '';
  let salt = ''

  let deviceId = ''; // or use some string that identifies current app user
  Countly.init(serverURL, appKey, deviceId);

  // configure other Countly parameters if needed
  Countly.enableParameterTamperingProtection(salt);
  Countly.enableLogging();

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
  Countly.userData.setProperty(name, value);
  this.userProperties[name] = value
}

export default CountlyTracker
