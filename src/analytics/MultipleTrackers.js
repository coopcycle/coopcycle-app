import BaseTracker from './BaseTracker'

function MultipleTrackers(tracker1, tracker2) {
  this.tracker1 = tracker1
  this.tracker2 = tracker2
}
MultipleTrackers.prototype = Object.create(BaseTracker.prototype);
MultipleTrackers.prototype.constructor = MultipleTrackers;

MultipleTrackers.prototype.setCurrentScreen = function(screenName, screenClassOverride) {
  this.tracker1.setCurrentScreen(screenName, screenClassOverride)
  this.tracker2.setCurrentScreen(screenName, screenClassOverride)
}

MultipleTrackers.prototype.logEvent = function(category, action, text, number) {
  this.tracker1.logEvent(category, action, text, number)
  this.tracker2.logEvent(category, action, text, number)
}

MultipleTrackers.prototype.setUserProperty = function(name, value) {
  this.tracker1.setUserProperty(name, value)
  this.tracker2.setUserProperty(name, value)
}

MultipleTrackers.prototype.init = function() {
  this.tracker1.init()
  this.tracker2.init()
}

export default MultipleTrackers
