import firebase from 'react-native-firebase'

/**
 * App behavior when receiving messages that include both notification and data payloads
 * depends on whether the app is in the background or the foreground—essentially,
 * whether or not it is active at the time of receipt.
 *
 * When in the background, apps receive the notification payload in the notification tray,
 * and only handle the data payload when the user taps on the notification.
 *
 * When in the foreground, your app receives a message object with both payloads available.
 *
 * @see https://rnfirebase.io/docs/v4.2.x/messaging/receiving-messages
 * @see https://rnfirebase.io/docs/v4.2.x/messaging/device-token
 * @see https://rnfirebase.io/docs/v4.2.x/notifications/receiving-notifications
 */

const parseNotification = (notification, isForeground) => {

  let data = notification.data

  if (data.hasOwnProperty('event')) {
    data.event = JSON.parse(data.event)
  }

  return {
    foreground: isForeground,
    data
  }
}

let notificationOpenedListener = () => {}
let notificationListener = () => {}
let tokenRefreshListener = () => {}

class PushNotification {

  static configure(options) {

    // Notification was received in the background
    notificationOpenedListener = firebase.notifications()
      .onNotificationOpened(notificationOpen => {
        options.onNotification(parseNotification(notificationOpen.notification, false))
    })

    // Notification was received in the foreground
    notificationListener = firebase.notifications()
      .onNotification(notification => {
        options.onNotification(parseNotification(notification, true))
    })

    firebase.messaging()
      .requestPermission()
      .then(() => {
        // User has authorised
      })
      .catch(error => {
        // User has rejected permissions
      })

    tokenRefreshListener = firebase.messaging()
      .onTokenRefresh(fcmToken => options.onRegister(fcmToken))

  }

  static removeListeners() {
    notificationOpenedListener()
    notificationListener()
    tokenRefreshListener()
  }

}

export default PushNotification
