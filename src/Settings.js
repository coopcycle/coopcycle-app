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

  static saveServer(server) {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.setItem('@Server', server)
          .then((error) => {
            if (error) {
              return reject(error)
            }
            resolve()
          });
      } catch (error) {
        reject(error.message)
      }
    });
  }

  static loadServer() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.getItem('@Server')
          .then((data, error) => {
            if (error) {
              return reject(error)
            }

            return resolve(data)
          });
      } catch (error) {
        reject(error.message)
      }
    });
  }

  static removeServer() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.removeItem('@Server')
          .then((error) => {
            if (error) {
              return reject(error)
            }
            resolve()
          });
      } catch (error) {
        reject(error.message)
      }
    });
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
        .catch(e => {
          try {
            AsyncStorage
              .getItem('@Settings')
              .then((data, error) => {
                if (error || !data) {
                  return reject(e)
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
