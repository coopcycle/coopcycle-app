import { AsyncStorage } from 'react-native'

const defaultPreferences = {
  tasksFilters: [],
}

class Preferences {

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
    })
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
    })
  }

  static setTasksFilters(filters) {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.setItem('@Preferences.tasksFilters', JSON.stringify(filters))
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

  static getTasksFilters() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.getItem('@Preferences.tasksFilters')
          .then((data, error) => {
            if (error) {
              return reject(error)
            }

            if (!data) {
              return resolve(defaultPreferences.tasksFilters)
            }

            return resolve(JSON.parse(data))
          });
      } catch (error) {
        reject(error.message)
      }
    })
  }

}

export default Preferences
