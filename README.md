CoopCycle
=========

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
