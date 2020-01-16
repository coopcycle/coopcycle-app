import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import AppUser from '../../../AppUser'

const BackgroundGeolocationEvents = [
  'start',
  'stop',
  'location',
  'error',
  'authorization',
]

const middleware = store => next => action => {

  const prevState = store.getState()
  const result = next(action)
  const state = store.getState()

  if (prevState.app.isAuthenticated !== state.app.isAuthenticated) {
    if (state.app.isAuthenticated && state.app.user && state.app.user.hasRole('ROLE_COURIER')) {

      BackgroundGeolocation.configure({
        url: state.app.httpClient.getBaseURL() + '/api/me/location',
        syncUrl: state.app.httpClient.getBaseURL() + '/api/me/location',
        httpHeaders: {
          'Authorization': `Bearer ${state.app.httpClient.getToken()}`,
          'Content-Type': 'application/ld+json',
        },
        postTemplate: {
          latitude: '@latitude',
          longitude: '@longitude',
          time: '@time',
        },
      })

      // This is called when server responded with "401 Unauthorized"
      BackgroundGeolocation.removeAllListeners('http_authorization')
      BackgroundGeolocation.on('http_authorization', () => {
        state.app.httpClient.refreshToken()
          .then(token => {
            BackgroundGeolocation.configure({
              httpHeaders: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/ld+json',
              },
            })
          })
          .catch(e => {
            // If the token could not be refreshed,
            // we mark the locations as deleted to stop retrying
            BackgroundGeolocation.deleteAllLocations()
          })
      })

      BackgroundGeolocation.start()

    } else {
      BackgroundGeolocation.stop()
      BackgroundGeolocationEvents.forEach(event => BackgroundGeolocation.removeAllListeners(event))
    }
  }

  return result
}

export default middleware
