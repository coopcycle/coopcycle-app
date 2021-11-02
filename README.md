CoopCycle
=========

[![Build Status](https://github.com/coopcycle/coopcycle-app/workflows/Build/badge.svg)](https://github.com/coopcycle/coopcycle-app/actions)

Prerequisites
-------------

* Install Node, Java Development Kit, Watchman & React Native CLI as described [here](https://reactnative.dev/docs/environment-setup).

    * You can install `react-native-cli` with following command:
        ```
            npm install –g react-native-cli
        ```

    * Or you can use `npx` which ships with Node.js instead of installing React Native CLI.

        With `npx react-native <command>`, the current stable version of the CLI will be downloaded and executed at the time the command is run.

* Install dependencies to compile [node-canvas](https://github.com/Automattic/node-canvas#compiling) depending on your OS.


Setup - Firebase
-------------

Create a [Firebase](https://firebase.google.com/) account.

#### Android
Follow the [Firebase instructions](https://firebase.google.com/docs/android/setup) to download and copy `google-services.json` to the `android/app` folder.

#### iOS
Follow the [Firebase instructions](https://firebase.google.com/docs/ios/setup) to download and copy `GoogleService-Info.plist` to the `ios/` folder.

Setup - All Platforms
---------------------

Install dependencies with Yarn.

```
$ yarn install
```

Populate your local `.env` file:
```
$ cp .env.dist .env
```

Setup - Linux
-------------

* To launch an Android emulator on Linux, you will need to [enable acceleration](https://developer.android.com/studio/run/emulator-acceleration).

* You can run the app on your Android device following [these instructions](https://reactnative.dev/docs/running-on-device).
    * You can display and control your Android device connected via USB with [scrcpy](https://github.com/Genymobile/scrcpy).

Setup - Android
---------------

### Get a Google Maps API Key

A Google Maps API Key is needed at compilation time for Android (see `AndroidManifest.xml`).

* To get an API key follow the instructions [Get API key](https://developers.google.com/maps/documentation/android-sdk/get-api-key)

* Make sure that you have `Maps SDK for Android` API enabled in your [Google Cloud Platform Console](https://console.cloud.google.com/google/maps-apis)

* Add your API key to `.env`

```
GOOGLE_MAPS_BROWSER_KEY=YOUR_API_KEY
GOOGLE_MAPS_ANDROID_KEY=YOUR_API_KEY
```

Those keys won't work for address autocomplete if you don't have [billing enabled in Google Cloud](https://cloud.google.com/billing/docs/how-to/manage-billing-account). Before enabling billing in your project, read and check the [the terms and conditions for the free trial](https://cloud.google.com/terms/free-trial/).

Setup - iOS
-----------

iOS development requires macOS and [CocoaPods](https://cocoapods.org/).

```
$ sudo gem install -n /usr/local/bin cocoapods
$ gem install cocoapods-user-defined-build-types
$ cd ios && pod install
```

Running App
-------

##### With React Native CLI

```
    yarn android
```

##### With Npx

```
    npx react-native start
    npx react-native android
```

For iOS replace `android` with `ios`.

Testing
-------

```
yarn test
```

Troubleshooting
---------------

« Have you tried turning it off and on again? »

```
watchman watch-del-all
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf ~/.rncache
rm -rf node_modules
rm yarn.lock
yarn cache clean
yarn install
```
