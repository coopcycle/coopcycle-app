CoopCycle
=========

![Build Status](https://github.com/coopcycle/coopcycle-app/actions/workflows/test_android.yml/badge.svg) ![Build Status](https://github.com/coopcycle/coopcycle-app/actions/workflows/test_ios.yml/badge.svg)

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

Enable Corepack

```sh
$ corepack enable
```

Install dependencies with Yarn.

```sh
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

### Get a Google Maps API Key

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

```sh
bundle install
```

Install the dependencies:

```sh
cd ios && USE_FRAMEWORKS=static NO_FLIPPER=1 bundle exec pod install
```

Or using [pod-install](https://www.npmjs.com/package/pod-install):

```sh
cd ios && USE_FRAMEWORKS=static NO_FLIPPER=1 npx pod-install
```

Running App
-------

### Start the bundler

```sh
make start
```

### Run the Android app

```sh
make android
```

### Run the iOS app

On any simulator:

```sh
make ios
```

With a picker to choose a specific simulator:

```sh
yarn ios --list-devices
```

On a connected physical device:

```sh
yarn ios --device
```

Testing
-------

```sh
make test
```

### Detox (end-to-end testing):

Setup: https://wix.github.io/Detox/docs/introduction/environment-setup

To run end-to-end tests locally make sure that:
* Set `APP_ENV` to `test` (already done when running from `Makefile` targets).
* Set `COOPCYCLE_WEB_REPO_PATH` in `.env` only if your path to `coopcycle-web` project is other than: `../coopcycle-web` (used to run e2e tests against local web instance).

#### Build the app:

Android:

```sh
make e2e-build-android
```

iOS:

```sh
make e2e-build-ios
```

#### Run tests:

Android:

```sh
make e2e-android
```

iOS:

```sh
make e2e-ios
```

Run a single test, set the `TESTFILE` env var when running `make e2e-android-only` or `make e2e-ios-only`:

```sh
make e2e-android-only TESTFILE=courier/success__task__complete.spec.js
```
(note that it omits the `e2e/` part of the path)

Run a single test in debug mode:

```sh
detox test -c ios.sim.debug --inspect-brk e2e/foodtech/first_launch.spec.js
```

Make sure that you have emulators set up as specified in `.detoxrc.js` > `devices`
or use `--device-name` parameter while running tests. For example:

```sh
detox test -c android.emu.debug --device-name="Pixel_8_API_34" e2e/foodtech/first_launch.spec.js
```

Troubleshooting
---------------

« Have you tried turning it off and on again? »

```
watchman watch-del-all
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf ~/.rncache
make start-fresh
```
