import AsyncStorage from '@react-native-community/async-storage'

import API from './API'

const defaultSettings = {
  google_api_key: '',
  stripe_publishable_key: '',
  locale: 'fr',
  country: 'fr',
  latlng: '48.872178,2.331797',
}

let serverSettings = {}

class Settings {

  static get(name) {
    if (serverSettings.hasOwnProperty(name)) {
      return serverSettings[name]
    }
  }

  static synchronize(baseURL) {
    return new Promise((resolve, reject) => {

      if (!baseURL) {

        return reject('baseURL is undefined')
      }

      const client = API.createClient(baseURL)

      return client.get('/api/settings')
        .then(settings => {
          AsyncStorage.setItem('@Settings', JSON.stringify(settings))
          serverSettings = Object.assign(defaultSettings, settings)
          resolve(serverSettings)
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
                serverSettings = settings
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
export { defaultSettings as defaults }
