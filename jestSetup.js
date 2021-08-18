/* global jest */

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationHolder from './src/NavigationHolder'

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

jest.mock('react-native-localize', () => ({
  findBestAvailableLanguage: () => ({ languageTag: 'en' }),
}));

jest.mock('rn-fetch-blob', () => ({
  fetch: () => {}
}));

jest.mock('tipsi-stripe', () => ({
  __esModule: true,
  default: {
    setOptions: () => {},
    createTokenWithCard: params => {}
  },
}))

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

const fakeNavigator = {
  current: {
    dispatch: (action) => {}
  }
}

NavigationHolder.setNavigationRef(fakeNavigator)
