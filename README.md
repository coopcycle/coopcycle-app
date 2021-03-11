CoopCycle
=========

[![Build Status](https://travis-ci.org/coopcycle/coopcycle-app.svg?branch=master)](https://travis-ci.org/coopcycle/coopcycle-app)

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
```

### Set up Firebase

* Create a [Firebase](https://firebase.google.com/) account, create a new app ( | [iOS](https://firebase.google.com/docs/ios/setup))

Setup - Android
---------------

### Get a Google Maps API Key

A Google Maps API Key is needed at compilation time for Android (see `AndroidManifest.xml`).

* To get an API key follow the instructions [Get API key](https://developers.google.com/maps/documentation/android-sdk/signup)

* Make sure that you have `Maps SDK for Android` API enabled in your [Google Cloud Platform Console](https://console.cloud.google.com/google/maps-apis)

* Create a `gradle.properties` file in `GRADLE_USER_HOME` (defaults to `~/.gradle`)

[Learn more about configuring Gradle Build Environment](https://docs.gradle.org/current/userguide/build_environment.html)

```
googleMapsApiKey=YOUR_API_KEY
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
