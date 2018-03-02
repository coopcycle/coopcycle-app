import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

// Avoid 'is not defined' errors when running tests
global.FormData = require('FormData')
global.Request = require('Request')

// mock 'fetch' globally
global.fetch = require('jest-fetch-mock')
