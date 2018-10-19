import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

jest.mock('react-native-languages', () => ({
  RNLanguages: {
    language: 'en',
    languages: ['en'],
  },
}));

// Avoid 'is not defined' errors when running tests
global.FormData = require('FormData')

// mock 'fetch' globally
global.fetch = require('jest-fetch-mock')
