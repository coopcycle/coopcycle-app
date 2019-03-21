/* global jest */

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationHolder from './src/NavigationHolder'

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

jest.mock('react-native-localize', () => ({
  __esModule: true,
  findBestAvailableLanguage: () => 'en',
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

const fakeNavigator = {
  dispatch: (action) => {}
}

NavigationHolder.setTopLevelNavigator(fakeNavigator)
