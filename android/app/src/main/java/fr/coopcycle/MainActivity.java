package fr.coopcycle;
import expo.modules.ReactActivityDelegateWrapper;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  @Override protected void onCreate(Bundle savedInstanceState) {

    // On Android the View state is not persisted consistently across Activity restarts, which can lead to crashes in those cases.
    // It is recommended to override the native Android method called on Activity restarts in your main Activity, to avoid these crashes.
    // https://github.com/software-mansion/react-native-screens#android
    // https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704633
    super.onCreate(null);

    // @see https://github.com/invertase/react-native-firebase/issues/2791
    // @see https://developer.android.com/training/notify-user/channels
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

      NotificationChannel notificationChannel = new NotificationChannel(
        "coopcycle_important",
        "Service Updates",
        NotificationManager.IMPORTANCE_HIGH
      );
      notificationChannel.setDescription("CoopCycle Service Updates");

      NotificationManager notificationManager = (NotificationManager) getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(notificationChannel);
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "CoopCycle";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(this, new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    });
  }
}
