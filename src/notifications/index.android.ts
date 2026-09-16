import { getMessaging, onNotificationOpenedApp, onMessage, getToken, getInitialNotification, onTokenRefresh } from '@react-native-firebase/messaging';
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
    try {
      data.event = JSON.parse(data.event);
    } catch (e) {}
  }

  return {
    foreground: isForeground,
    data,
  };
};

/**
 * Push notifications need Google Play Services, which are absent on
 * de-Googled Android builds (CalyxOS, /e/OS, LineageOS...). Every entry point
 * below can reject or throw there; the app must keep working without push
 * rather than surface an unhandled rejection.
 * @see https://github.com/coopcycle/coopcycle-app/issues/2113
 */
const onPushUnavailable = (step: string, e: unknown) => {
  console.log(`Push notifications unavailable (${step}):`, e);
};

const registerToken = (options: { onRegister: (token: string) => void }) => {
  getToken(getMessaging())
    .then(fcmToken => options.onRegister(fcmToken))
    .catch(e => onPushUnavailable('getToken', e));
};

let notificationOpenedAppListener = () => {};
let notificationListener = () => {};
let dataListener = () => {};
let tokenRefreshListener = () => {};

class PushNotification {
  static configure(options) {
    // Notification was received in the background (and opened by a user)
    notificationOpenedAppListener = onNotificationOpenedApp(
      getMessaging(),
      remoteMessage => {
        options.onNotification(parseNotification(remoteMessage, false));
      },
    );

    // Notification was received in the foreground
    // in the current implementation, server sends both
    // "notification + data" and "data-only" messages (with the same data),
    // handle only "notification + data" messages when the app is in the foreground
    notificationListener = onMessage(getMessaging(),remoteMessage => {
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
          registerToken(options);
        }
      });
    } else {
      registerToken(options);
    }

    try {
      tokenRefreshListener = onTokenRefresh(getMessaging(), fcmToken =>
        options.onRegister(fcmToken),
      );
    } catch (e) {
      onPushUnavailable('onTokenRefresh', e);
    }
  }

  static getInitialNotification() {
    return getInitialNotification(getMessaging())
      .then(remoteMessage => {
        return remoteMessage ? parseNotification(remoteMessage, false) : null;
      })
      .catch(e => {
        onPushUnavailable('getInitialNotification', e);
        return null;
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
