import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import axios from 'axios'

import i18n from '../../../i18n'
import { setBackgroundGeolocationEnabled } from '../../App/actions'
import { selectIsAuthenticated } from '../../App/selectors'

export default ({ getState, dispatch }) => {

  const options = {
    accuracy: Location.Accuracy.BestForNavigation,
    distanceInterval: 10,
    deferredUpdatesInterval: 5000,
    foregroundService: {
      notificationTitle: i18n.t('BACKGROUND_GEOLOCATION_NOTIFICATION_TITLE'),
      notificationBody: i18n.t('BACKGROUND_GEOLOCATION_NOTIFICATION_TEXT'),
    },
  }

  TaskManager.defineTask('location-updates', ({ data: { locations }, error }) => {

    if (error) {
      console.log(error)
      return;
    }

    const state = getState()

    const { baseURL, user } = state.app

    if (!baseURL) {
      return
    }

    if (!user) {
      return
    }

    if (!user.token) {
      return
    }

    const payload = locations.map(loc => ({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      time: loc.timestamp,
    }))

    axios({
      method: 'post',
      url: `${baseURL}/api/me/location`,
      data: payload,
      headers: {
        'Accept': 'application/ld+json',
        'Content-Type': 'application/ld+json',
        'Authorization': `Bearer ${user.token}`,
      },
    })
    .then(function (response) {
      // TODO
    })
    .catch((e) => console.log(e))

  })

  return (next) => (action) => {

    const prevState = getState()
    const result = next(action)
    const state = getState()

    const hasUserChanged = state.app.user !== prevState.app.user

    if (!hasUserChanged) {
      return result
    }

    if (selectIsAuthenticated(state) && state.app.user && state.app.user.hasRole('ROLE_COURIER')) {

      Location.requestPermissionsAsync().then((permissions) => {
        if (permissions.status === 'granted') {
          Location.startLocationUpdatesAsync('location-updates', options)
            .then(() => dispatch(setBackgroundGeolocationEnabled(true)))
        }
      })

    } else {
      Location.hasStartedLocationUpdatesAsync('location-updates')
        .then(started => {
          if (started) {
            Location.stopLocationUpdatesAsync('location-updates')
              .then(() => dispatch(setBackgroundGeolocationEnabled(false)))
          }
        })
    }

    return result
  }
}
