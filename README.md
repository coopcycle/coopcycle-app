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
