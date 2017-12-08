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
./gradlew clean && ./gradlew assembleRelease
```