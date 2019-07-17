CoopCycle
=========

[![Build Status](https://travis-ci.org/coopcycle/coopcycle-app.svg?branch=master)](https://travis-ci.org/coopcycle/coopcycle-app)

Prerequisites
-------------

Install Node, Watchman & React Native CLI as described [here](https://facebook.github.io/react-native/docs/getting-started.html).

Installation
------------

Install dependencies with Yarn.

```
$ yarn install
```

On MacOSX, you will also need to install [CocoaPods](https://cocoapods.org/).

```
$ sudo gem install -n /usr/local/bin cocoapods
```

Running on Android emulator
-----------------------

NB: You may need to open the Android project in Android Studio before it builds.
```
react-native run-android
```

### Get a Google Maps API Key

A Google Maps API Key is needed at compilation time for Android (see `AndroidManifest.xml`).

* To get an API key follow the instructions [Get API key](https://developers.google.com/maps/documentation/android-sdk/signup)

* Make sure that you have `Maps SDK for Android` API enabled in your [Google Cloud Platform Console](https://console.cloud.google.com/google/maps-apis)

* Create a `gradle.properties` file in `GRADLE_USER_HOME` (defaults to `~/.gradle`)

[Learn more about configuring Gradle Build Environment](https://docs.gradle.org/current/userguide/build_environment.html)

```
googleMapsApiKey=YOUR_API_KEY
```

### Setup Firebase

* Setup a Firebase account and download `google-services.json` [Add Firebase](https://firebase.google.com/docs/android/setup)
* Copy `google-services.json` to the `android/app` folder


Running on iOS emulator
-----------------------

NB: You may need to open the iOS project in Xcode before it builds.
Make sure that you open Xcode Workspace file (`*.xcworkspace`).

```
react-native run-ios
```

Testing
---------------

```
yarn test
```

Troubleshooting
---------------

« Have you tried turning it off and on again? »

```
watchman watch-del-all
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/haste-map-react-native-packager-*
rm -rf ~/.rncache
rm -rf node_modules
rm yarn.lock
yarn cache clean
yarn install
```

### Android

#### Gradle project sync failed in Android Studio. ERROR: The minSdk version should not be declared in the android manifest file.
Affected Modules: `react-native-mauron85-background-geolocation`, `react-native-mauron85-background-geolocation-common`

Remove line:
```
<uses-sdk android:minSdkVersion="14" />
```
from `react-native-mauron85-background-geolocation/AndroidManifest.xml` and `react-native-mauron85-background-geolocation-common/AndroidManifest.xml` files until this [issue](https://github.com/mauron85/react-native-background-geolocation/issues/357) is resolved

#### Gradle project sync failed in Android Studio.
Try to run
```
yarn
```
in the project directory to get the latest dependencies (in `node_modules` folder)

### iOS

