import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

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

      return axios.get(`${baseURL}/api/settings`, { timeout: 10000 })
        .then(res => {
          AsyncStorage.setItem('@Settings', JSON.stringify(res.data))
          resolve(Object.assign(defaultSettings, res.data))
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
