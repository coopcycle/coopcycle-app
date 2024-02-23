package fr.coopcycle

import expo.modules.ReactActivityDelegateWrapper

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.WindowManager

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {

    // On Android the View state is not persisted consistently across Activity restarts, which can lead to crashes in those cases.
    // It is recommended to override the native Android method called on Activity restarts in your main Activity, to avoid these crashes.
    // https://github.com/software-mansion/react-native-screens#android
    // https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704633
    super.onCreate(null)

    // @see https://github.com/invertase/react-native-firebase/issues/2791
    // @see https://developer.android.com/training/notify-user/channels
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

      NotificationChannel notificationChannel = new NotificationChannel(
        "coopcycle_important",
        "Service Updates",
        NotificationManager.IMPORTANCE_HIGH
      )
      notificationChannel.setDescription("CoopCycle Service Updates")

      NotificationManager notificationManager = (NotificationManager) getSystemService(NotificationManager.class)
      notificationManager.createNotificationChannel(notificationChannel)
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "CoopCycle"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }
}
