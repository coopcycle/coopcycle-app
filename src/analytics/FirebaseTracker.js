import BaseTracker from './BaseTracker'
import analytics from '@react-native-firebase/analytics'

function FirebaseTracker() { }
FirebaseTracker.prototype = Object.create(BaseTracker.prototype);
FirebaseTracker.prototype.constructor = FirebaseTracker;

FirebaseTracker.prototype.setCurrentScreen = function(screenName) {
  analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  })
}

FirebaseTracker.prototype.logEvent = function(category, action, text, number) {
  let event = category + '_' + action

  let params = {}

  if (text != null) {
    params.text = text
  }

  if (number != null) {
    params.number = number
  }

  analytics().logEvent(event, params);
}

FirebaseTracker.prototype.setUserProperty = function(name, value) {
  analytics().setUserProperty(name, value)
}

export default FirebaseTracker
