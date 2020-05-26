function BaseTracker() {
}

/**
 * Sets the current screen name, which specifies the current visual context in your app.
 * Whilst screenClassOverride is optional,
 * it is recommended it is always sent as your current class name,
 * for example on Android it will always show as 'MainActivity' if not specified.
 * screenName: string | null
 */
BaseTracker.prototype.setCurrentScreen = function(screenName) {
}

/**
 * Log a custom event with optional params.
 * category: string,
 * action: string,
 * text?: string (optional parameter)
 * number?: double (optional parameter)
 */
BaseTracker.prototype.logEvent = function(category, action, text, number) {
}

/**
 * Sets a key/value pair of data on the current user.
 * name: string,
 * value: string | null
 */
BaseTracker.prototype.setUserProperty = function(name, value) {
}

export default BaseTracker
