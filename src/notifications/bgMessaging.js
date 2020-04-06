// @flow
import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';
import launchActivity from './launchActivity';
import notificationManager from './notificationManager';
import store from '../redux/store'
import {loadOrderAndPushNotification} from '../redux/Restaurant/actions'
import {parseNotification} from './index.android'
import {analyticsEvent} from '../Analytics'
import {Platform} from 'react-native';

// it seems that firebase always shows a notification with id = 0 (int)
// react-native-firebase library works with ids as Strings, and takes a hash code
// to convert String to int, the hash code of 'f5a5a608' is 0.
const firebaseNotificationId = 'f5a5a608'

// data message was received in the background (works only on android)
export default async (remoteMessage: RemoteMessage) => {
  const message = parseNotification(remoteMessage, false)

  const { event } = message.data

  if (event && event.name === 'order:created') {
    firebase.analytics().logEvent(
      analyticsEvent.restaurant.orderCreatedMessage,
      {medium: 'background_data_message'})

    const {order} = event.data

    if (Platform.Version < 29) {
      // remove a notification shown by firebase
      // in response to "notification+data" message
      notificationManager.cancel('order:created', firebaseNotificationId)

      launchActivity.invoke()

      //todo we dont have much time here (10-20 seconds) may be just keep id somewhere
      //and load order later?

      store.dispatch(loadOrderAndPushNotification(order))

    } else {
      // android 10 and later
      // keep a notification shown by firebase
      // because to be able to launch an activity we must
      // get a special permission from a user
    }
  }


  return Promise.resolve();
}
