import { AsyncStorage } from 'react-native'
import JSONAsyncStorage from '../storage'

describe('JSONAsyncStorage', () => {

  jest.mock('AsyncStorage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
  }))

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => jest.unmock('AsyncStorage'))

  test('get | valid JSON', () => {
    const storedValue = []
    AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify(storedValue)))

    return JSONAsyncStorage.get('foo')
      .then((value) => {
        expect(value).toEqual(storedValue)
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
      })
  })

  test('get | invalid JSON', () => {
    AsyncStorage.getItem.mockReturnValue(Promise.resolve('not json'))

    return JSONAsyncStorage.get('foo')
      .catch((error) => {
        expect(error).toBeInstanceOf(Error)
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
      })
  })

  test('set', () => {
    JSONAsyncStorage.set('foo', { bar: 1 })

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('foo', JSON.stringify({ bar: 1 }))
  })

  test('update | existing key', () => {
    AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify([1])))

    return JSONAsyncStorage.update('foo', [], (xs) => xs.concat(2))
      .then(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('foo', JSON.stringify([1, 2]))
      })
  })

  test('consume | array', () => {
    AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify([1, 2])))

    return JSONAsyncStorage.consume('foo', () => 0)
      .then(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('foo', JSON.stringify([]))
      })
  })

  test('consume | object', () => {
    AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify({ 1: 1, 2: 2 })))

    return JSONAsyncStorage.consume('foo', () => 0)
      .then(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('foo', JSON.stringify({}))
      })
  })
})
