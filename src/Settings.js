import { AsyncStorage } from 'react-native'
import EventEmitter from 'EventEmitter'
import AppConfig from './AppConfig'

let events = new EventEmitter()

class Settings {

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
            events.emit('server:remove')
            resolve()
          });
      } catch (error) {
        reject(error.message)
      }
    });
  }

  static addListener(event, handler) {
    events.addListener(event, handler)
  }

  static removeListener(event, handler) {
    events.removeListener(event, handler)
  }

  static getKeepAwake() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.getItem('@Settings.keepAwake')
          .then((data, error) => {
            if (error) {
              return reject(error)
            }

            if (!data) {
              return resolve(false)
            }

            return resolve(JSON.parse(data))
          });
      } catch (error) {
        reject(error.message)
      }
    });
  }

  static setKeepAwake(keepAwake) {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.setItem('@Settings.keepAwake', JSON.stringify(keepAwake))
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

  static saveServerSettings(settings) {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.setItem('@Settings.server', JSON.stringify(settings))
          .then((error) => {
            if (error) {
              return reject(error)
            }
            resolve()
          })
      } catch (error) {
        reject(error.message)
      }
    })
  }

  static initAppConfig() {
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

            const settings = JSON.parse(data)

            Object.assign(AppConfig, {
              GOOGLE_API_KEY: settings['google_api_key'],
              STRIPE_PUBLISHABLE_KEY: settings['stripe_publishable_key'],
              LOCALE: settings['locale'],
              COUNTRY_NAME: settings['country'],
              GCM_SENDER_ID: '',
            })
            resolve()
          })
      } catch (error) {
        reject(error.message)
      }
    })
  }

}

module.exports = { Settings, events }
