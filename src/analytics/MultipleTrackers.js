import BaseTracker from './BaseTracker'

function MultipleTrackers(trackers) {
  this.trackers = trackers
}
MultipleTrackers.prototype = Object.create(BaseTracker.prototype);
MultipleTrackers.prototype.constructor = MultipleTrackers;

MultipleTrackers.prototype.setCurrentScreen = function(screenName, screenClassOverride) {
  this.trackers.forEach(tracker => tracker.setCurrentScreen(screenName, screenClassOverride))
}

MultipleTrackers.prototype.logEvent = function(category, action, text, number) {
  this.trackers.forEach(tracker => tracker.logEvent(category, action, text, number))
}

MultipleTrackers.prototype.setUserProperty = function(name, value) {
  this.trackers.forEach(tracker => tracker.setUserProperty(name, value))
}

MultipleTrackers.prototype.init = function() {
  this.trackers.forEach(tracker => tracker.init())
}

export default MultipleTrackers
