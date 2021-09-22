package fr.coopcycle;

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
    super.onCreate(savedInstanceState);

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
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
