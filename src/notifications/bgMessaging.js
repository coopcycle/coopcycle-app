// @flow
import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';
import LaunchActivity from './launchActivity';

export default async (message: RemoteMessage) => {
  //todo handle your data (message) received in background

  console.log('data message (in background): ' + message.messageId)

  LaunchActivity.launch()

  return Promise.resolve();
}
