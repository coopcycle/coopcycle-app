import BaseTracker from './BaseTracker'

import Matomo from 'react-native-matomo'
import userProperty from './UserProperty'

function MatomoTracker() {
  this.trackerInitialized = false

  //todo
  // const siteId = Settings.get('piwik_site_id')
  const siteId = 1
  if (siteId) {
    Matomo.initTracker('https://piwik.coopcycle.org/piwik.php', siteId)
    this.trackerInitialized = true
  } else {
    this.trackerInitialized = false
  }
}

MatomoTracker.prototype = Object.create(BaseTracker.prototype);
MatomoTracker.prototype.constructor = MatomoTracker;

MatomoTracker.prototype.setCurrentScreen = function(screenName, screenClassOverride) {
  if (!this.trackerInitialized) {
    return
  }

  Matomo.trackScreen(screenName)
}

MatomoTracker.prototype.logEvent = function(category, action, text, number) {
  if (!this.trackerInitialized) {
    // todo cache calls and send them later?
    return
  }

  Matomo.trackEvent(category, action, text, number);
}

MatomoTracker.prototype.setUserProperty = function(name, value) {
  if (!this.trackerInitialized) {
    // todo cache calls and send them later?
    return
  }

  // custom dimensions must be configured first in Matomo Settings

  let id = 0;
  if (name === userProperty.server) {
    id = 1
  } else if (name === userProperty.roles) {
    id = 2
  }

  if (id !== 0) {
    Matomo.setCustomDimension(id, value);
  }
}

export default MatomoTracker
