package fr.coopcycle;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LaunchActivityModule extends ReactContextBaseJavaModule {
  private final String TAG = "LaunchActivityModule";

  private static ReactApplicationContext reactContext;

  LaunchActivityModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @ReactMethod
  public void launch() {
    //todo

    Log.d(TAG, "launch");

    Context context = getReactApplicationContext();

    Intent intent = new Intent(context, MainActivity.class)
      .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    context.startActivity(intent);
  }

  @Override
  public String getName() {
    return "LaunchActivityModule";
  }
}
