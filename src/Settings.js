import { AsyncStorage } from 'react-native'
import API from './API'
import _ from 'lodash'

const loadServerSettingsHash = baseURL => {
  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.getItem(`@Settings.hash.${baseURL}`)
        .then((data, e) => {
          if (e) {
            return reject(e.message)
          }
          resolve(data)
        })
    } catch (error) {
      reject(error.message)
    }
  })
}

const loadServerSettings = () => {
  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.getItem('@Settings.server')
        .then((data, error) => {
          if (error) {
            return reject(error)
          }
          if (!data) {
            return reject('No server settings found')
          }
          resolve(JSON.parse(data))
        })
    } catch (e) {
      reject(e.message)
    }
  })
}

const saveServerSettings = (baseURL, settings, hash) => {
  return new Promise((resolve, reject) => {
    try {
      Promise.all([
        AsyncStorage.setItem(`@Settings.hash.${baseURL}`, hash),
        AsyncStorage.setItem('@Settings.server', JSON.stringify(settings))
      ])
      .then(values => {
        const errors = _.filter(values)
        if (errors.length > 0) {
          return reject()
        }
        resolve()
      })
      .catch(e => reject(e))
    } catch (e) {
      reject(e.message)
    }
  })
}

const defaultSettings = {
  google_api_key: '',
  stripe_publishable_key: '',
  locale: 'fr',
  country: 'fr',
  latlng: '48.872178,2.331797',
  piwik_site_id: -1,
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
          serverSettings = Object.assign(defaultSettings, settings)
          resolve(serverSettings)
        })
        .catch(e => reject(e))

      /*
      return loadServerSettingsHash(baseURL)
        .then(hash => {
          const client = API.createClient(baseURL)
          if (hash) {
            return client.get('/api/settings?format=hash')
              .then(remoteHash => {
                if (remoteHash === hash) {
                  return loadServerSettings()
                }
                return client.get('/api/settings')
                  .then(settings => {
                    return saveServerSettings(baseURL, settings, remoteHash)
                      .then(() => settings)
                  })
              })
          } else {
            return Promise.all([
              client.get('/api/settings'),
              client.get('/api/settings?format=hash')
            ]).then(values => {
              const [ settings, hash ] = values
              return saveServerSettings(baseURL, settings, hash)
                .then(() => settings)
            })
          }
        })
        .then(settings => {
          serverSettings = Object.assign(defaultSettings, settings)
          return serverSettings
        })
        .then(settings => resolve(settings))
        .catch(e => reject(e))
      */
    })
  }

}

export default Settings
export { defaultSettings as defaults }
