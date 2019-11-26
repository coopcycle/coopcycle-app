import AsyncStorage from '@react-native-community/async-storage'
import Settings, { defaults as defaultSettings } from '../src/Settings'
import API from '../src/API'

const mockClient = (responses) => {
  API.createClient = jest.fn(() => {
    return {
      get: jest.fn(uri => {
        if (responses.hasOwnProperty(uri)) {
          return Promise.resolve(responses[uri])
        }
      })
    }
  })
}

afterEach(() => {
  AsyncStorage.clear()
});

it('rejects when baseURL is undefined', () => {
  expect.assertions(1);
  return Settings.synchronize(undefined).catch(e => expect(e).toMatch('baseURL is undefined'));
})
