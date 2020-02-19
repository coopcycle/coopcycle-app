import firebase from 'react-native-firebase'
import { Alert, AppState, Linking } from 'react-native'
import _ from 'lodash'

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

export const parseNotification = (notification, isForeground) => {

  let data = notification.data

  if (data.event && _.isString(data.event)) {
    data.event = JSON.parse(data.event)
  }

  return {
    foreground: isForeground,
    data,
  }
}

let notificationOpenedListener = () => {}
let notificationListener = () => {}
let tokenRefreshListener = () => {}
let appStateChangeListener = () => {}

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

    // FIXME
    // firebase.messaging().requestPermission() always resolves to null
    // We tell the user to open the app settings to enable notifications

    // firebase.messaging()
    //   .requestPermission()
    //   .then(() => {
    //     // User has authorised
    //   })
    //   .catch(error => {
    //     // User has rejected permissions
    //   })

    firebase.messaging().hasPermission()
      .then(enabled => {

        if (!enabled) {

          Alert.alert(
            'Notifications désactivées',
            'Voulez-vous ouvrir les paramètres de l\'application ?',
            [
              {
                text: 'Annuler',
                onPress: () => {},
              },
              {
                text: 'Ouvrir',
                onPress: () => {

                  appStateChangeListener = nextState => {
                    // User is coming back from app settings
                    // Check again if notifications have been enabled
                    if (nextState === 'active') {
                      AppState.removeEventListener('change', appStateChangeListener)
                      firebase.messaging().hasPermission()
                        .then(enabled => {
                          firebase.messaging()
                            .getToken()
                            .then(fcmToken => {
                              if (fcmToken) {
                                options.onRegister(fcmToken)
                              }
                            })
                        })
                        .catch(e => console.log(e))
                    }
                  }
                  AppState.addEventListener('change', appStateChangeListener)

                  Linking.openSettings()
                },
              },
            ],
            {
              cancelable: true,
            }
          )
        } else {
          firebase.messaging()
            .getToken()
            .then(fcmToken => {
              if (fcmToken) {
                options.onRegister(fcmToken)
              }
            })
        }

      })
      .catch(e => console.log(e))

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
