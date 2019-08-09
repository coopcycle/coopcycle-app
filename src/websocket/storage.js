/*
 * JSON Async Storage
 *
 * A simple abstraction build on top of react-native's `AsyncStorage`.
 * Simplifies dealing with the storage and manipulation of stringified JSON
 */
import AsyncStorage from '@react-native-community/async-storage'

const JSONAsyncStorage = {
  get: (key) =>
    AsyncStorage.getItem(key).then(JSON.parse),

  set: (key, value) =>
    AsyncStorage.setItem(key, JSON.stringify(value)),

  update: (key, defaultValue, fn) =>
    JSONAsyncStorage.get(key)
      .then((v) => v === null ? defaultValue : v)
      .then(fn)
      .then((value) => JSONAsyncStorage.set(key, value)),

  consume: (key, fn) => {
    let data = null

    return JSONAsyncStorage
      .update(key, null, (json) => {
        // Data must be cached locally and emptied in the store
        // before the provided consumer function `fn` is called
        // incase `fn` manipulates the store
        data = json

        return Array.isArray(json)
          ? []
          : json && typeof json === 'object'
            ? {}
            : json
      })
      .then(() => data && Object.values(data).forEach(fn))
  },
}

export default JSONAsyncStorage
