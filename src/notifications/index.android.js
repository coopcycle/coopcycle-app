import messaging from '@react-native-firebase/messaging';
import _ from 'lodash';
import { PermissionsAndroid, Platform } from 'react-native';

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
 * @see https://rnfirebase.io/messaging/usage
 */

export const parseNotification = (remoteMessage, isForeground) => {
  let data = remoteMessage.data;

  if (data.event && _.isString(data.event)) {
    data.event = JSON.parse(data.event);
  }

  return {
    foreground: isForeground,
    data,
  };
};

let notificationOpenedAppListener = () => {};
let notificationListener = () => {};
let dataListener = () => {};
let tokenRefreshListener = () => {};

class PushNotification {
  static configure(options) {
    // Notification was received in the background (and opened by a user)
    notificationOpenedAppListener = messaging().onNotificationOpenedApp(
      remoteMessage => {
        options.onNotification(parseNotification(remoteMessage, false));
      },
    );

    // Notification was received in the foreground
    // in the current implementation, server sends both
    // "notification + data" and "data-only" messages (with the same data),
    // handle only "notification + data" messages when the app is in the foreground
    notificationListener = messaging().onMessage(remoteMessage => {
      // @see https://rnfirebase.io/messaging/usage#foreground-state-messages
      if (remoteMessage.data) {
        options.onBackgroundMessage(parseNotification(remoteMessage, true));
      }
    });

    // @see https://rnfirebase.io/messaging/usage
    // On Android API level 32 and below, you do not need to request user permission.
    // This method can still be called on Android devices; however, and will always resolve successfully. For API level 33+ you will need to request the permission manually
    if (Platform.Version >= 33) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ).then(results => {
        if (PermissionsAndroid.RESULTS.GRANTED === results) {
          messaging()
            .getToken()
            .then(fcmToken => {
              console.log(fcmToken);
              options.onRegister(fcmToken);
            });
        }
      });
    } else {
      messaging()
        .getToken()
        .then(fcmToken => options.onRegister(fcmToken));
    }

    tokenRefreshListener = messaging().onTokenRefresh(fcmToken =>
      options.onRegister(fcmToken),
    );
  }

  static getInitialNotification() {
    return new Promise((resolve, reject) => {
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            resolve(parseNotification(remoteMessage, false));
          } else {
            resolve(null);
          }
        });
    });
  }

  static removeListeners() {
    notificationOpenedAppListener();
    notificationListener();
    dataListener();
    tokenRefreshListener();
  }
}

export default PushNotification;
