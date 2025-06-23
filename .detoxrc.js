/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      config: 'e2e/jest.config.js',
      _: ['e2e/dispatch/success__create_delivery.spec.js'],
    },
    retries: 2,
  },
  artifacts: {
    plugins: {
      log: 'failing',
      screenshot: 'failing',
      //FIXME: video recording doesn't seem to work
      video: {
        android: {
          "bitRate": 4000000
        },
        simulator: {
          "codec": "hevc"
        }
      }
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
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug --warning-mode all && cd ..',
      launchArgs: {},
    },
    'android.release': {
      type: 'android.apk',
      binaryPath:
        'android/app/build/outputs/apk/official/release/app-official-release.apk',
      build:
        'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release -DuseDebugCertificate=yes -DminifyEnabled=no -DuploadCrashlyticsMappingFile=no --no-daemon --warning-mode all && cd ..',
      launchArgs: {},
    },
  },
  devices: {
    iosSimulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15', os: 'iOS 17.5' },
    },
    androidEmulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_6_API_28' },
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
      device: 'iosSimulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'iosSimulator',
      app: 'ios.release',
    },
    'android.emu.debug': {
      device: 'androidEmulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'androidEmulator',
      app: 'android.release',
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release',
    },
  },
};
