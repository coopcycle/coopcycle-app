import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

class GeolocationTracker {

  geolocationOptions = {
    enableHighAccuracy: false
  }
  watchID = null
  options = {
    onChange: position => {}
  }
  latLng: {
    latitude: 0,
    longitude: 0
  }

  constructor(options) {
    this.options = options

    // For Android, use the default options
    let geolocationOptions = {}

    if (Platform.OS === 'ios') {
      Object.assign(geolocationOptions, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000
      })
    }

    this.geolocationOptions = geolocationOptions
  }

  getLatLng() {
    return this.latLng
  }

  start() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {

          this.latLng = position.coords
          this.options.onChange(position)
          resolve()

          this.watchID = navigator.geolocation.watchPosition(
            position => {
              this.latLng = position.coords
              this.options.onChange(position)
            },
            error => reject(error),
            this.geolocationOptions
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
