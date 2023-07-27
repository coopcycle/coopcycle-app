/* global jest */

import NavigationHolder from './src/NavigationHolder'

jest.mock('react-native-localize', () => ({
  findBestAvailableLanguage: () => ({ languageTag: 'en' }),
}));

jest.mock('react-native-blob-util', () => ({
  fetch: () => {},
  wrap: () => {}
}));

jest.mock('expo-file-system', () => ({
  createUploadTask: jest.fn(),
  FileSystemUploadType: {
    MULTIPART: 1
  },
  FileSystemSessionType: {
    BACKGROUND: 0
  }
}));

jest.mock('@react-native-firebase/analytics', () => ({
  logEvent: jest.fn(),
  setUserProperty: jest.fn(),
}))

jest.mock('@react-native-firebase/messaging', () => ({
}))

jest.mock('countly-sdk-react-native-bridge', () => ({
  enableParameterTamperingProtection: () => {},
  init: () => {},
  start: () => {},
  recordView: () => {},
}));

jest.mock('react-native-background-geolocation', () => ({
  DESIRED_ACCURACY_HIGH: -1,
  LOG_LEVEL_VERBOSE: 5,
  LOG_LEVEL_OFF: 0,
  onEnabledChange: jest.fn(),
  ready: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  removeListeners: jest.fn(),
  changePace: jest.fn(),
}))

jest.mock('@stripe/stripe-react-native', () => ({
}))

jest.mock('react-native-share', () => ({
}))

const fakeNavigator = {
  current: {
    dispatch: (action) => {}
  }
}

NavigationHolder.setNavigationRef(fakeNavigator)
