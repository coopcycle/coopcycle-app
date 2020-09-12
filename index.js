import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import ReactNativeForegroundService from '@supersami/react-native-foreground-service'

import App from './src/App';
import bgMessaging from './src/notifications/bgMessaging';

bgMessaging();

// This will register your headless task.
ReactNativeForegroundService.register();

AppRegistry.registerComponent('CoopCycle', () => App);
