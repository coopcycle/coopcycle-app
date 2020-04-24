function BaseTracker() {
}

/**
 * Sets the current screen name, which specifies the current visual context in your app.
 * Whilst screenClassOverride is optional,
 * it is recommended it is always sent as your current class name,
 * for example on Android it will always show as 'MainActivity' if not specified.
 */
BaseTracker.prototype.setCurrentScreen = function(screenName, screenClassOverride) {
}

/**Log a custom event with optional params. */
BaseTracker.prototype.logEvent = function(event, params) {
}

export default BaseTracker
