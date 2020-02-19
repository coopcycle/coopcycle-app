import { AppState } from 'react-native'
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

      notificationListener = notification => {
        // Don't use PushNotificationIOS.FetchResult.NoData
        // @see https://github.com/invertase/react-native-firebase/issues/1870
        notification.finish('backgroundFetchResultNoData')
        options.onNotification(parseNotification(notification, AppState.currentState === 'active'))
      }
      PushNotificationIOS.addEventListener('notification', notificationListener)

      PushNotificationIOS
        .getInitialNotification()
        .then(notification => {
          if (notification !== null) {
            notification.finish(PushNotificationIOS.FetchResult.NoData)
            options.onNotification(parseNotification(notification, false))
          }
        })

      PushNotificationIOS
        .requestPermissions()
        .catch(e => console.log(e))

      isConfigured = true
    }

  }

  static removeListeners() {
    PushNotificationIOS.removeEventListener('register', registerListener)
    PushNotificationIOS.removeEventListener('notification', notificationListener)
  }

}

export default PushNotification
