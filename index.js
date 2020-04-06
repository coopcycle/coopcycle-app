import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import bgMessaging from './src/notifications/bgMessaging'; // <-- Import the file you created in (2)

AppRegistry.registerComponent('CoopCycle', () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
