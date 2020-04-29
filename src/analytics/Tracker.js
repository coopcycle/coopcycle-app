import FirebaseTracker from './FirebaseTracker'
import MatomoTracker from './MatomoTracker'
import MultipleTrackers from './MultipleTrackers'

const tracker = new MultipleTrackers(new FirebaseTracker(), new MatomoTracker())

export default tracker
