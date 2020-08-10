import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import App from './src/App';
import bgMessaging from './src/notifications/bgMessaging';

// @see https://rnfirebase.io/messaging/usage#background-application-state

messaging().setBackgroundMessageHandler(bgMessaging);

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent('CoopCycle', () => App);
