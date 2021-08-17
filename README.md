CoopCycle
=========

[![Build Status](https://github.com/coopcycle/coopcycle-app/workflows/Build/badge.svg)](https://github.com/coopcycle/coopcycle-app/actions)

Prerequisites
-------------

Install Node, Watchman & React Native CLI as described [here](https://reactnative.dev/docs/environment-setup).

Install dependencies to compile [node-canvas](https://github.com/Automattic/node-canvas#compiling) depending on your OS.

Setup - All Platforms
---------------------

Install dependencies with Yarn.

```
$ yarn install
```

Populate your local `.env` file:
```
$ cp .env.dist .env
$ cp google-services.json.dist android/app/google-services.json
```

### Set up Firebase

* Create a [Firebase](https://firebase.google.com/) account, create a new app ( | [iOS](https://firebase.google.com/docs/ios/setup))

Setup - Linux
-------------

To launch an Android emulator on Linux, you will need to [enable acceleration](https://developer.android.com/studio/run/emulator-acceleration)

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

* Follow the [Firebase instructions](https://firebase.google.com/docs/android/setup) to download and copy `google-services.json` to the `android/app` folder


Setup - iOS
-----------

iOS development requires macOS and [CocoaPods](https://cocoapods.org/).

```
$ sudo gem install -n /usr/local/bin cocoapods
$ cd ios && pod install
```

* Follow the [Firebase instructions](https://firebase.google.com/docs/ios/setup) to download and copy `GoogleService-Info.plist` to the `ios/` folder

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
