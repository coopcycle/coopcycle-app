import messaging from '@react-native-firebase/messaging';
import launchActivity from './launchActivity';
import notificationManager from './notificationManager';
import store from '../redux/store'
import {loadOrderAndPushNotification, loadOrder} from '../redux/Restaurant/actions'
import {message as wsMessage} from '../redux/middlewares/WebSocketMiddleware/actions'
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

    store.dispatch(loadOrder(event.data.order, (order) => {
      if (order) {
        // Simulate a WebSocket message
        store.dispatch(wsMessage({
          name: 'order:created',
          data: { order }
        }))
      }
    }))
  }

  return Promise.resolve();
}

export default () => {
  // The background message handler below is *ALWAYS* called
  // when the app is in background or quit state
  // @see https://rnfirebase.io/messaging/usage#background-application-state
  messaging().setBackgroundMessageHandler(handler);
}
