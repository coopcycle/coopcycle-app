import * as Notifications from 'expo-notifications';

const parseNotification = (notification, isForeground = null) => {
  return {
    foreground: isForeground,
    data: notification.request.trigger.payload,
  };
};

let isConfigured = false;

let notificationResponseReceivedListener = notification => {};

// https://docs.expo.dev/versions/v52.0.0/sdk/notifications/

class PushNotification {
  static async configure(options) {

    // https://docs.expo.dev/versions/latest/sdk/notifications/#present-incoming-notifications-when-the-app-is
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    // Listeners registered by this method will be called whenever a user interacts with a notification (for example, taps on it).
    notificationResponseReceivedListener = Notifications.addNotificationResponseReceivedListener(response => {
      options.onNotification(parseNotification(response.notification, false))
    });

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // Failed to get push token for push notification
      return;
    }

    try {
      const devicePushToken = await Notifications.getDevicePushTokenAsync();
      options.onRegister(devicePushToken.data);
    } catch (e) {
      return
    }
  }

  static getInitialNotification() {
    return new Promise((resolve, reject) => {
       Notifications.getLastNotificationResponseAsync()
        .then(response => {
          if (response?.notification) {
            resolve(parseNotification(response.notification, false));
          } else {
            resolve(null);
          }
        });
    });
  }

  static removeListeners() {
    notificationResponseReceivedListener.remove();
  }
}

export default PushNotification;
