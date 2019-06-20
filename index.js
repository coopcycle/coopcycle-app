import { AppRegistry } from 'react-native';
import App from './src/App';
import { Sentry } from 'react-native-sentry';

Sentry.config('https://78c4cd6982b1431da17959adeb1f1fdf@sentry.io/1486946').install();

AppRegistry.registerComponent('CoopCycle', () => App);
