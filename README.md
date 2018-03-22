CoopCycle
=========

[![Build Status](https://travis-ci.org/coopcycle/coopcycle-app.svg?branch=master)](https://travis-ci.org/coopcycle/coopcycle-app)

Prerequisites
-------------

Install Node, Watchman & React Native CLI as described [here](https://facebook.github.io/react-native/docs/getting-started.html).

Installation
------------

Install dependencies with Yarn, and link them with React Native CLI.

```
$ yarn install
$ sudo gem install cocoapods
$ react-native link
```

* Get a Google Map API Key and copy it. You will need to have the [
Google Maps SDK for iOS](https://console.developers.google.com/apis/api/maps-ios-backend.googleapis.com/overview?project=coopcycle-dev-1495029274413&duration=PT1H) and [Google Maps Android API](https://console.developers.google.com/apis/api/maps-android-backend.googleapis.com/overview?project=coopcycle-dev-1495029274413&duration=PT1H) services enabled.
* Create a Stripe account and copy your tests credentials.
* Create the file AppConfig.json in ./src and copy the following lines, replacing **** by the corresponding API key:

```
{
"GOOGLE_API_KEY": "****",
"STRIPE_PUBLISHABLE_KEY": "****"
}
````

Running on Android emulator
-----------------------

NB: You may need to open the Android project in Android Studio before it builds.

* Create a `gradle.properties` file in `GRADLE_USER_HOME` (defaults to `~/.gradle`)

[Learn more about configuring Gradle Build Environment](https://docs.gradle.org/current/userguide/build_environment.html)

```
googleMapsApiKey=YOUR_API_KEY
```

* Download `Android Studio`

Running on iOS emulator
-----------------------

NB: You may need to open the iOS project in xCode before it builds.

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
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/haste-map-react-native-packager-*
rm -rf ~/.rncache
rm yarn.lock
yarn cache clean
yarn install
react-native link
```
