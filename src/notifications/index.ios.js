import PushNotificationIOS from '@react-native-community/push-notification-ios'

let registerListener = deviceToken => {}
let notificationListener = notification => {}

const parseNotification = (notification, isForeground = null) => {
  return {
    foreground: isForeground,
    data: notification.getData(),
  }
}

let isConfigured = false

class PushNotification {

  static configure(options) {

    if (!isConfigured) {

      // WARNING
      // We need to call addEventListener BEFORE calling requestPermissions, or the whole thing does not work
      // @see https://github.com/facebook/react-native/issues/9105#issuecomment-246180895
      registerListener = deviceToken => options.onRegister(deviceToken)
      PushNotificationIOS.addEventListener('register', registerListener)

      // @see https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/pushing_background_updates_to_your_app
      //
      // The system treats background notifications as low priority:
      // you can use them to refresh your app’s content, but the system doesn’t guarantee their delivery.
      // In addition, the system may throttle the delivery of background notifications if the total number becomes excessive.
      // The number of background notifications allowed by the system depends on current conditions,
      // but don’t try to send more than two or three per hour.
      //
      // The server does *NOT* include a content-available key in the payload.
      // Thus, this listener is never called
      //
      // PushNotificationIOS.addEventListener('notification', () => {})

      // This listener is called when a notification is *TAPPED*,
      // wether the app is in the foreground or the background
      PushNotificationIOS.addEventListener('localNotification', notification => {
        // We *MUST* call this or the rest doesn't work
        notification.finish(PushNotificationIOS.FetchResult.NoData)
        options.onNotification(parseNotification(notification, false))
      })

      PushNotificationIOS
        .requestPermissions()
        .catch(e => console.log(e))

      isConfigured = true
    }

  }

  static getInitialNotification() {
    return new Promise((resolve, reject) => {
      PushNotificationIOS.getInitialNotification()
        .then(notification => {
          if (notification) {
            resolve(parseNotification(notification, false))
          } else {
            resolve(null)
          }
        })
    })
  }

  static removeListeners() {
    PushNotificationIOS.removeEventListener('register', registerListener)
    PushNotificationIOS.removeEventListener('notification', notificationListener)
  }

}

export default PushNotification
