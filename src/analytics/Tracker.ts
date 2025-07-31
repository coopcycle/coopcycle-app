import FirebaseTracker from './FirebaseTracker';
import MultipleTrackers from './MultipleTrackers';

const tracker = new MultipleTrackers([
  new FirebaseTracker(),
]);

export default tracker;
