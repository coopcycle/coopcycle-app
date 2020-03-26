// @flow
import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';
import launchActivity from './launchActivity';
import store from '../redux/store'
import {loadOrderAndPushNotification} from '../redux/Restaurant/actions'
import {parseNotification} from './index.android'

// data message was received in the background (works only on android)
export default async (remoteMessage: RemoteMessage) => {
  const message = parseNotification(remoteMessage, false)

  const { event } = message.data

  if (event && event.name === 'order:created') {
    const {order} = event.data

    launchActivity.invoke()

    //todo we dont have much time here (10-20 seconds) may be just keep id somewhere
    //and load order later?

    store.dispatch(loadOrderAndPushNotification(order))
  }
  return Promise.resolve();
}
