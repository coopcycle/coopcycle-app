CoopCycle
=========

Prerequisites
-------------

Install Node, Watchman & React Native CLI as described [here](https://facebook.github.io/react-native/docs/getting-started.html).

Installation
------------

Install dependencies with NPM, and link them with React Native CLI.

```
$ npm install
$ react-native link
```

For Android, create a `gradle.properties` file in `GRADLE_USER_HOME` (defaults to `~/.gradle`)
[Learn more about configuring Gradle Build Environment](https://docs.gradle.org/current/userguide/build_environment.html)

```
googleMapsApiKey=YOUR_API_KEY
```

Running on iOS emulator
-----------------------

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
rm -rf ~/.rncache
rm yarn.lock
yarn cache clean
yarn install
react-native link
```
