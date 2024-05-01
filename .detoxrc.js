/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      config: 'e2e/jest.config.js',
      maxWorkers: process.env.CI ? 2 : undefined,
      _: ['e2e'],
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/CoopCycle.app',
      build:
        'xcodebuild -workspace ios/CoopCycle.xcworkspace -scheme CoopCycle -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build -quiet',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/CoopCycle.app',
      build:
        'xcodebuild ONLY_ACTIVE_ARCH=YES -arch x86_64 -workspace ios/CoopCycle.xcworkspace -scheme CoopCycle -configuration Release -sdk iphonesimulator -derivedDataPath ios/build -quiet',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath:
        'android/app/build/outputs/apk/official/debug/app-official-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug --warning-mode all --stacktrace && cd ..',
      launchArgs: {},
    },
    'android.release': {
      type: 'android.apk',
      binaryPath:
        'android/app/build/outputs/apk/official/release/app-official-release.apk',
      build:
        'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release -DuseDebugCertificate=yes -DminifyEnabled=no --warning-mode all --stacktrace && cd ..',
      launchArgs: {},
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' },
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_8_API_34' },
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*', // any attached device
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release',
    },
  },
};
