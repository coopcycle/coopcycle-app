import { Alert, AppState, PushNotificationIOS } from 'react-native'
import _ from 'lodash'

let PushNotification = require('react-native-push-notification');

PushNotification.configure({
  onNotification: function(notification) {
    console.log( 'NOTIFICATION:', notification );

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

})

function sendTasksAssignNotification (tasks) {
  let message, subText

  if (tasks.length === 1) {
    message = "Nouvelle tâche!"
    subText = "La tâche #" + tasks[0]['id'] + " pour " + tasks[0].address.streetAddress + "a été ajoutée."
  } else {
    message = "Nouvelles tâches!"
    subText = ''
    _.each(tasks, (task) => {
      subText += "La tâche #" + task['id'] + " pour " + task.address.streetAddress + "a été ajoutée.\n"
    })
  }

  if (AppState.currentState === 'active') {
    Alert.alert(
      message,
      subText,
      [
        {
          text: 'OK', onPress: () => {}
        },
      ],
      { cancelable: false }
    )
  }

  PushNotification.localNotification({
    ticker: "My Notification Ticker", // (optional)
    largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
    message: message, // (optional) default: "message" prop
    subText: subText, // (optional) default: none
    color: "red", // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: 'task', // (optional) add tag to message
    group: "task", // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification


    /* iOS and Android properties */
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  })
}

function sendTasksUnassignkNotification (tasks) {
  let message, subText

  if (tasks.length === 1) {
    message = "Tâche annulée!"
    subText = "La tâche #" + tasks[0]['id'] + " pour " + tasks[0].address.streetAddress + "a été annulée."
  } else {
    message = "Tâches annulées!"
    subText = ""
    _.each(tasks, (task) => {
      subText += "La tâche #" + task['id'] + " pour " + task.address.streetAddress + "a été annulée."
    })
  }

  if (AppState.currentState === 'active') {
    Alert.alert(
      message,
      subText,
      [
        {
          text: 'OK', onPress: () => {}
        },
      ],
      { cancelable: false }
    )
  }

  PushNotification.localNotification({
    ticker: "My Notification Ticker", // (optional)
    largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
    message: message, // (optional) default: "message" prop
    subText: subText, // (optional) default: none
    color: "red", // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: 'task', // (optional) add tag to message
    group: "task", // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification


    /* iOS and Android properties */
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  })
}

export {
  sendTasksAssignNotification,
  sendTasksUnassignkNotification
}
