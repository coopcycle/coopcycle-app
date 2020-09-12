import BackgroundGeolocation from 'react-native-background-geolocation'

import i18n from '../../../i18n'
import { setBackgroundGeolocationEnabled } from '../../App/actions'
import { selectIsAuthenticated } from '../../App/selectors'

import tracker from '../../../analytics/Tracker'
import analyticsEvent from '../../../analytics/Event'

export default ({ getState, dispatch }) => {

  return (next) => (action) => {

    const prevState = getState()
    const result = next(action)
    const state = getState()

    const hasUserChanged = state.app.user !== prevState.app.user

    if (!hasUserChanged) {
      return result
    }

    BackgroundGeolocation.onEnabledChange(isEnabled => {
      dispatch(setBackgroundGeolocationEnabled(isEnabled))
    })

    if (selectIsAuthenticated(state) && state.app.user && state.app.user.hasRole('ROLE_COURIER')) {

      BackgroundGeolocation.ready({
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        debug: process.env.NODE_ENV === 'development', // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: process.env.NODE_ENV === 'development' ?
          BackgroundGeolocation.LOG_LEVEL_VERBOSE : BackgroundGeolocation.LOG_LEVEL_OFF,
        stopOnTerminate: true,
        startOnBoot: false,
        url: `${state.app.baseURL}/api/me/location`,
        // https://transistorsoft.github.io/react-native-background-geolocation/interfaces/_react_native_background_geolocation_.config.html#authorization
        authorization: {
          strategy: 'JWT',
          accessToken: state.app.user.token,
          refreshToken: state.app.user.refreshToken,
          refreshUrl: `${state.app.baseURL}/api/token/refresh`,
          refreshPayload: {
            refresh_token: '{refreshToken}',
          },
        },
        batchSync: true,
        locationTemplate: '{"latitude":<%= latitude %>,"longitude":<%= longitude %>,"time":"<%= timestamp %>"}', // --> {"location":[[48.87586622822684,2.370307076470255,{}]]}
        // Use an array payload
        httpRootProperty: '.',
        autoSyncThreshold: 5,
        autoSync: true,
        locationAuthorizationRequest: 'Any',
      }, (state) => {
        dispatch(setBackgroundGeolocationEnabled(state.enabled))
        if (!state.enabled) {
          BackgroundGeolocation.start(function() {
            if (process.env.NODE_ENV === 'development') {
              setTimeout(() => BackgroundGeolocation.changePace(true), 5000)
            }
          })
        }
      })

    } else {
      BackgroundGeolocation.stop()
      BackgroundGeolocation.removeListeners();
    }

    return result
  }
}
