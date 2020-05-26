import FirebaseTracker from './FirebaseTracker'
import CountlyTracker from './CountlyTracker'
import MultipleTrackers from './MultipleTrackers'

const tracker = new MultipleTrackers(new FirebaseTracker(), new CountlyTracker())

export default tracker
