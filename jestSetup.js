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

jest.mock('expo-location', () => ({
  Accuracy: {
    BestForNavigation: ''
  },
  hasServicesEnabledAsync: jest.fn().mockResolvedValue(true),
  startLocationUpdatesAsync: jest.fn().mockImplementation(() => Promise.resolve()),
  hasStartedLocationUpdatesAsync: jest.fn().mockResolvedValue(true),
  stopLocationUpdatesAsync: jest.fn().mockImplementation(() => Promise.resolve()),
}))

jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
}))

jest.mock('countly-sdk-react-native-bridge', () => ({
  enableParameterTamperingProtection: () => {},
  init: () => {},
  start: () => {},
  recordView: () => {},
}));

const fakeNavigator = {
  dispatch: (action) => {}
}

NavigationHolder.setTopLevelNavigator(fakeNavigator)
