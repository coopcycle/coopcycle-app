import AsyncStorage from '@react-native-community/async-storage'

import API from './API'

const defaultSettings = {
  google_api_key: '',
  stripe_publishable_key: '',
  locale: 'fr',
  country: 'fr',
  latlng: '48.872178,2.331797',
}

class Settings {

  static synchronize(baseURL) {
    return new Promise((resolve, reject) => {

      if (!baseURL) {

        return reject('baseURL is undefined')
      }

      const client = API.createClient(baseURL)

      return client.get('/api/settings')
        .then(settings => {
          AsyncStorage.setItem('@Settings', JSON.stringify(settings))
          resolve(Object.assign(defaultSettings, settings))
        })
        .catch(() => {
          try {
            AsyncStorage
              .getItem('@Settings')
              .then((data, error) => {
                if (error || !data) {
                  return reject(error)
                }

                const settings = JSON.parse(data)
                resolve(settings)
              })
          } catch (e) {
            reject(e)
          }
        })
    })
  }

}

export default Settings
