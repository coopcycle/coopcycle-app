if (__DEV__) {
  require('./ReactotronConfig');
}

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { enableFreeze } from 'react-native-screens';

// Freeze blurred screens (react-freeze). Screens stacked below the current one
// — e.g. the dispatch map / task list under the proof-of-delivery flow — stop
// re-rendering until refocused, so they don't steal the main thread. Makes
// freezeOnBlur default to true across all navigators.
enableFreeze(true);

import App from './src/App';
import bgMessaging from './src/notifications/bgMessaging';

bgMessaging();

AppRegistry.registerComponent('CoopCycle', () => App);
