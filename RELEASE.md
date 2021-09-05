Releasing on Google Play
------------------------

https://facebook.github.io/react-native/docs/signed-apk-android.html

Edit `~/.gradle/gradle.properties` to configure the keystore

```
COOPCYCLE_RELEASE_STORE_FILE=my-release-key.keystore
COOPCYCLE_RELEASE_KEY_ALIAS=my-key-alias
COOPCYCLE_RELEASE_STORE_PASSWORD=*****
COOPCYCLE_RELEASE_KEY_PASSWORD=*****
```

Copy the keystore in `android/app/`

Generate a signed APK

```
cd android/
./gradlew clean && ./gradlew bundleRelease
```

Signed APK file can be found in `android/app/build/outputs/apk/release/app-release.apk`

Testing the signed APK on emulator
----------------------------------

For further testing, you can install the signed APK on the emulator.

If you have installed the debug APK, you have to uninstall it first.

```
cd $ANDROID_HOME/platform-tools
./adb install app-release.apk
```
