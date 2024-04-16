import FirebaseTracker from './FirebaseTracker';
import MultipleTrackers from './MultipleTrackers';

const tracker = new MultipleTrackers([
  new FirebaseTracker(),
  // Disable Countly at the the moment
  // @see https://github.com/Countly/countly-sdk-react-native-bridge/issues/28
  // new CountlyTracker()
]);

export default tracker;
