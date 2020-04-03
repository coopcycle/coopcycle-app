package fr.coopcycle;

import android.app.NotificationManager;
import android.content.Context;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NotificationManagerModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  NotificationManagerModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @ReactMethod
  public void cancel(String tag, String notificationId) {
    Context context = getReactApplicationContext();

    NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    notificationManager.cancel(tag, notificationId.hashCode());
  }

  @Override
  public String getName() {
    return "NotificationManagerModule";
  }
}
