package fr.coopcycle;

import android.app.Application;
import android.support.multidex.MultiDexApplication;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import org.reactnative.camera.RNCameraPackage;
import com.polidea.reactnativeble.BlePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.terrylinla.rnsketchcanvas.SketchCanvasPackage;
import com.horcrux.svg.SvgPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.zmxv.RNSound.RNSoundPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.coopcycle.pin.RNPinScreenPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.opensettings.OpenSettingsPackage;
import de.bonify.reactnativematomo.MatomoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

// To enable multidex on API Level < 21,
// we need to extend android.support.multidex.MultiDexApplication instead of android.app.Application
// https://developer.android.com/studio/build/multidex.html
public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AsyncStoragePackage(),
            new RNCameraPackage(),
          new BlePackage(),
          new RNFetchBlobPackage(),
          new SketchCanvasPackage(),
          new SvgPackage(),
          new RNGestureHandlerPackage(),
          new RNSoundPackage(),
          new RNFirebasePackage(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseNotificationsPackage(),
          new BackgroundGeolocationPackage(),
          new RNLanguagesPackage(),
          new KCKeepAwakePackage(),
          new RNPinScreenPackage(),
          new StripeReactPackage(),
          new OpenSettingsPackage(),
          new MapsPackage(),
          new MatomoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
