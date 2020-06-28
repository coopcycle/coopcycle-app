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

jest.mock('react-native-firebase', () => ({
  perf: () => ({
    newTrace: () => ({
      start: () => {},
      incrementMetric: () => {}
    })
  })
}))

jest.mock('@mauron85/react-native-background-geolocation', () => ({
  configure: jest.fn(),
  removeAllListeners: jest.fn(),
  on: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
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
