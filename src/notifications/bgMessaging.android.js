import messaging from '@react-native-firebase/messaging';
import launchActivity from './launchActivity';
import notificationManager from './notificationManager';
import store from '../redux/store'
import {loadOrderAndPushNotification} from '../redux/Restaurant/actions'
import {parseNotification} from './index.android'
import tracker from '../analytics/Tracker'
import analyticsEvent from '../analytics/Event'
import {Platform} from 'react-native';

// it seems that firebase always shows a notification with id = 0 (int)
// react-native-firebase library works with ids as Strings, and takes a hash code
// to convert String to int, the hash code of 'f5a5a608' is 0.
const firebaseNotificationId = 'f5a5a608'

// data message was received in the background (works only on android)
const handler = async (remoteMessage) => {
  const message = parseNotification(remoteMessage, false)

  const { event } = message.data

  if (event && event.name === 'order:created') {
    tracker.logEvent(
      analyticsEvent.restaurant._category,
      analyticsEvent.restaurant.orderCreatedMessage,
      'background_data_message')

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

export default () => {
  // The background message handler below is *ALWAYS* called
  // when the app is in background or quit state
  // @see https://rnfirebase.io/messaging/usage#background-application-state
  messaging().setBackgroundMessageHandler(handler);
}
