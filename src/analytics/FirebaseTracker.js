import BaseTracker from './BaseTracker'
import firebase from 'react-native-firebase'

function FirebaseTracker() { }
FirebaseTracker.prototype = Object.create(BaseTracker.prototype);
FirebaseTracker.prototype.constructor = FirebaseTracker;

FirebaseTracker.prototype.setCurrentScreen = function(screenName, screenClassOverride) {
  firebase.analytics().setCurrentScreen(screenName, screenClassOverride)
}

FirebaseTracker.prototype.logEvent = function(event, params) {
  firebase.analytics().logEvent(event, params);
}

FirebaseTracker.prototype.setUserProperty = function(name, value) {
  firebase.analytics().setUserProperty(name, value)
}

export default FirebaseTracker
