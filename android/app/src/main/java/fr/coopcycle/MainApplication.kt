package fr.coopcycle

import android.content.res.Configuration
import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

import android.content.Intent

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost

import android.os.Handler
import android.os.Looper
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.security.ProviderInstaller
import com.google.android.gms.security.ProviderInstaller.ProviderInstallListener

import androidx.multidex.MultiDexApplication

// To enable multidex on API Level < 21,
// we need to extend android.support.multidex.MultiDexApplication instead of android.app.Application
// https://developer.android.com/studio/build/multidex.html
class MainApplication : MultiDexApplication(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
      this,
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return PackageList(this).packages
        }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
    }
  )

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    // Deferred so it can never delay startup: despite its name,
    // installIfNeededAsync binds to Google Play Services on the calling thread
    // before going async, which stalls on de-Googled builds where GMS is
    // absent or provided by microG.
    // @see https://github.com/coopcycle/coopcycle-app/issues/2113
    Handler(Looper.getMainLooper()).post { upgradeSecurityProvider() }
    try {
      DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
    } catch (e: IllegalArgumentException) {
      DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.STABLE
    }
    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }

  private fun upgradeSecurityProvider() {
    try {
      ProviderInstaller.installIfNeededAsync(this, object : ProviderInstallListener {
        override fun onProviderInstalled() {}
        override fun onProviderInstallFailed(errorCode: Int, recoveryIntent: Intent?) {
          // Only nag when Play Services are actually present but need attention.
          // On a device without them the notification is pure noise: there is
          // nothing the user can do about it.
          if (errorCode != ConnectionResult.SERVICE_MISSING &&
              errorCode != ConnectionResult.SERVICE_INVALID) {
            GoogleApiAvailability.getInstance().showErrorNotification(this@MainApplication, errorCode)
          }
        }
      })
    } catch (e: Throwable) {
      // The security provider is an optional upgrade; the app must still start
      // when Play Services cannot supply one.
      e.printStackTrace()
    }
  }
}
