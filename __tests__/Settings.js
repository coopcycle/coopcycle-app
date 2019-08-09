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

/*
it('does nothing when hash is the same', async () => {

  const baseURL = 'http://localhost'

  const hash = 'abcdef123456';
  const expectedSettings = Object.assign(defaultSettings, {
    google_api_key: 'abc123456',
  })

  await AsyncStorage.setItem(`@Settings.hash.${baseURL}`, hash)
  await AsyncStorage.setItem('@Settings.server', JSON.stringify(expectedSettings))

  mockClient({
    '/api/settings?format=hash': hash
  })

  const actualSettings = await Settings.synchronize(baseURL)
  expect(actualSettings).toStrictEqual(expectedSettings)
})

it('loads settings from server when hash is not stored', async () => {

  const baseURL = 'http://localhost'

  const remoteHash = '123456abcdef';

  const localSettings  = Object.assign(defaultSettings, {})
  const remoteSettings = Object.assign(defaultSettings, {
    google_api_key: 'abc123456',
  })

  await AsyncStorage.setItem('@Settings.server', JSON.stringify(defaultSettings))

  const expectedSettings =

  mockClient({
    '/api/settings?format=hash': remoteHash,
    '/api/settings': remoteSettings
  })

  const actualSettings = await Settings.synchronize(baseURL)
  const actualHash = await AsyncStorage.getItem(`@Settings.hash.${baseURL}`)

  expect(actualSettings).toStrictEqual(remoteSettings)
  expect(actualHash).toEqual(remoteHash)
})

it('loads settings from server when hash has changed', async () => {

  const baseURL = 'http://localhost'

  const localHash = 'abcdef123456';
  const remoteHash = '123456abcdef';

  const localSettings  = Object.assign(defaultSettings, {})
  const remoteSettings = Object.assign(defaultSettings, {
    google_api_key: 'abc123456',
  })

  await AsyncStorage.setItem(`@Settings.hash.${baseURL}`, localHash)
  await AsyncStorage.setItem('@Settings.server', JSON.stringify(localSettings))

  mockClient({
    '/api/settings?format=hash': remoteHash,
    '/api/settings': remoteSettings
  })

  const actualSettings = await Settings.synchronize(baseURL)
  const actualHash = await AsyncStorage.getItem(`@Settings.hash.${baseURL}`)

  expect(actualSettings).toStrictEqual(remoteSettings)
  expect(actualHash).toEqual(remoteHash)
})
*/
