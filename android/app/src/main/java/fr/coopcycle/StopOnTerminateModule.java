package fr.coopcycle;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.widget.Toast;
import android.util.Log;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.Collection;
import com.facebook.react.bridge.NativeModule;

import com.facebook.react.bridge.PromiseImpl;
import com.facebook.react.bridge.NativeArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.DynamicFromObject;
import com.facebook.react.bridge.Callback;

import org.unimodules.adapters.react.NativeModulesProxy;

public class StopOnTerminateModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  private static final String TAG = "StopOnTerminateModule";

  private ReactApplicationContext mContext;

  public StopOnTerminateModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mContext = reactContext;
    reactContext.addLifecycleEventListener(this);
  }

  @Override
  public String getName() {
    return "StopOnTerminate";
  }

  @Override
  public void onHostResume() {
  }

  @Override
  public void onHostPause() {
  }

  @Override
  public void onHostDestroy() {

    Log.d(TAG, "onHostDestroy");

    try {

      Collection<NativeModule> modules = mContext.getCatalystInstance().getNativeModules();

      for (NativeModule module : modules) {

        if (module instanceof NativeModulesProxy) {

          WritableNativeArray arguments = new WritableNativeArray();
          arguments.pushString("location-updates");

          Callback resolve = new Callback() {
            @Override
            public void invoke(Object... args) {
              Log.d(TAG, "Location updates stopped");
            }
          };
          Callback reject = new Callback() {
            @Override
            public void invoke(Object... args) {

            }
          };

          PromiseImpl cb = new PromiseImpl(resolve, reject);

          ((NativeModulesProxy) module).callMethod("ExpoLocation", new DynamicFromObject("stopLocationUpdatesAsync"), arguments, cb);

        }
      }

    } catch (Exception e) {
      Log.e(TAG, "Error while stopping location updates", e);
    }
  }
}
