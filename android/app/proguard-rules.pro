# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# https://firebase.google.com/docs/crashlytics/get-deobfuscated-reports?platform=android
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# https://rnfirebase.io/docs/v5.x.x/installation/android#Using-with-Proguard-enabled
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

# [react-native-background-fetch]
-keep class com.transistorsoft.rnbackgroundfetch.HeadlessTask { *; }

# https://github.com/luggit/react-native-config#problems-with-proguard
-keep class fr.coopcycle.BuildConfig { *; }

# https://github.com/react-native-svg/react-native-svg/issues/1061
-keep public class com.horcrux.svg.** {*;}

# https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation#proguard
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# https://reactnative.dev/docs/hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# https://github.com/expo/expo/issues/20122
# https://github.com/expo/expo/pull/20197
-keepclassmembers class * implements expo.modules.kotlin.views.ExpoView {
  public <init>(android.content.Context);
  public <init>(android.content.Context, expo.modules.kotlin.AppContext);
}
-keepclassmembers class * {
  expo.modules.kotlin.viewevent.ViewEventCallback *;
}
-keepclassmembers class * {
  expo.modules.kotlin.viewevent.ViewEventDelegate *;
}

# https://github.com/Vydia/react-native-background-upload
-keep class net.gotev.uploadservice.** { *; }
