if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';

import App from './src/App';
import bgMessaging from './src/notifications/bgMessaging';

bgMessaging();

AppRegistry.registerComponent('CoopCycle', () => App);
