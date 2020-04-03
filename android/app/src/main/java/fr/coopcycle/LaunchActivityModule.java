package fr.coopcycle;

import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LaunchActivityModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  LaunchActivityModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @ReactMethod
  public void invoke() {
    Context context = getReactApplicationContext();

    Intent intent = MainActivity.newIntent(context, true)
      .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    context.startActivity(intent);
  }

  @Override
  public String getName() {
    return "LaunchActivityModule";
  }
}
