import { Platform } from 'react-native'

class GeolocationTracker {

  geolocationOptions = {
    enableHighAccuracy: false
  }
  watchID = null
  options = {
    onChange: position => {}
  }

  constructor(options) {
    this.options = options

    if (Platform.OS === 'ios') {
      this.geolocationOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000
      }
    }
  }

  start() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.watchID = navigator.geolocation.watchPosition(
            position => {
              this.options.onChange(position)
              resolve()
            },
            error => reject(error)
          )
        },
        error => reject(error),
        this.geolocationOptions
      )
    })
  }

  stop() {
    navigator.geolocation.clearWatch(this.watchID)
  }

}

module.exports = GeolocationTracker