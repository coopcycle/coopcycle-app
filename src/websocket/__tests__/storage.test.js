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
    const data = [1, 2]
    const consumer = jest.fn()
    AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify(data)))

    return JSONAsyncStorage.consume('foo', consumer)
      .then(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('foo', JSON.stringify([]))
        expect(consumer).toHaveBeenCalledTimes(data.length)
        expect(consumer).toHaveBeenLastCalledWith(2, 1, data)
      })
  })

  test('consume | object', () => {
    const data = { a: 1, b: 2 }
    const consumer = jest.fn()
    AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify(data)))

    return JSONAsyncStorage.consume('foo', consumer)
      .then(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('foo', JSON.stringify({}))
        expect(consumer).toHaveBeenCalledTimes(Object.keys(data).length)
        expect(consumer).toHaveBeenLastCalledWith(2, 1, [1, 2])
      })
  })

  test('consume | empty', () => {
    const data = null
    const consumer = jest.fn()
    AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify(data)))

    return JSONAsyncStorage.consume('foo', consumer)
      .then(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('foo', JSON.stringify(data))
        expect(consumer).not.toHaveBeenCalled()
      })
  })
})
