package fr.coopcycle;

import android.content.Intent;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RestaurantForegroundServiceModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  private static final String TAG = "RestaurantForegroundServiceModule";

  RestaurantForegroundServiceModule(ReactApplicationContext context) {
    super(context);
    getReactApplicationContext().addLifecycleEventListener(this);
  }

  @Override
  public String getName() {
    return "RestaurantForegroundService";
  }

  @Override
  public void onHostResume() {
  }

  @Override
  public void onHostPause() {
  }

  @Override
  public void onHostDestroy() {

    Log.d(TAG, "RestaurantForegroundServiceModule.onHostDestroy()");

    getReactApplicationContext().stopService(
      new Intent(getReactApplicationContext(), RestaurantForegroundService.class)
    );
  }

  @ReactMethod
  public void start() {

    Log.d(TAG, "RestaurantForegroundServiceModule.start()");

    getReactApplicationContext().startService(
      new Intent(getReactApplicationContext(), RestaurantForegroundService.class)
    );
  }

  @ReactMethod
  public void stop() {

    Log.d(TAG, "RestaurantForegroundServiceModule.stop()");

    getReactApplicationContext().stopService(
      new Intent(getReactApplicationContext(), RestaurantForegroundService.class)
    );
  }
}
