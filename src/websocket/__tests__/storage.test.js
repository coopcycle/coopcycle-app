import AsyncStorage from '@react-native-community/async-storage'
import JSONAsyncStorage from '../storage'

describe('JSONAsyncStorage', () => {

  beforeEach(() => {
    AsyncStorage.clear()
  })

  test('get | valid JSON', async () => {
    const storedValue = []
    await AsyncStorage.setItem('foo', JSON.stringify(storedValue))

    return JSONAsyncStorage.get('foo')
      .then((value) => {
        expect(value).toEqual(storedValue)
      })
  })

  test('get | invalid JSON', async () => {
    await AsyncStorage.setItem('foo', 'not json')

    return JSONAsyncStorage.get('foo')
      .catch((error) => {
        expect(error).toBeInstanceOf(Error)
      })
  })

  test('set', async () => {
    await JSONAsyncStorage.set('foo', { bar: 1 })

    const value = await AsyncStorage.getItem('foo')
    expect(value).toBe(JSON.stringify({ bar: 1 }))
  })

  test('update | existing key', async () => {
    await AsyncStorage.setItem('foo', JSON.stringify([1]))

    return JSONAsyncStorage.update('foo', [], (xs) => xs.concat(2))
      .then(async () => {
        const value = await AsyncStorage.getItem('foo')
        expect(value).toBe(JSON.stringify([1, 2]))
      })
  })

  test('consume | array', async () => {
    const data = [1, 2]
    const consumer = jest.fn()
    await AsyncStorage.setItem('foo', JSON.stringify(data))

    return JSONAsyncStorage.consume('foo', consumer)
      .then(async () => {
        const value = await AsyncStorage.getItem('foo')
        expect(value).toBe(JSON.stringify([]))
        expect(consumer).toHaveBeenCalledTimes(data.length)
        expect(consumer).toHaveBeenLastCalledWith(2, 1, data)
      })
  })

  test('consume | object', async () => {
    const data = { a: 1, b: 2 }
    const consumer = jest.fn()
    await AsyncStorage.setItem('foo', JSON.stringify(data))

    return JSONAsyncStorage.consume('foo', consumer)
      .then(async () => {
        const value = await AsyncStorage.getItem('foo')
        expect(value).toBe(JSON.stringify({}))
        expect(consumer).toHaveBeenCalledTimes(Object.keys(data).length)
        expect(consumer).toHaveBeenLastCalledWith(2, 1, [1, 2])
      })
  })

  test('consume | empty', async () => {
    const data = null
    const consumer = jest.fn()
    await AsyncStorage.setItem('foo', JSON.stringify(data))

    return JSONAsyncStorage.consume('foo', consumer)
      .then(async () => {
        const value = await AsyncStorage.getItem('foo')
        expect(value).toBe(JSON.stringify(data))
        expect(consumer).not.toHaveBeenCalled()
      })
  })
})
