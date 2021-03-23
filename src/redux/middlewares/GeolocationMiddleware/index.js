import { Alert, Platform } from 'react-native'
import BackgroundGeolocation from 'react-native-background-geolocation'

import i18n from '../../../i18n'
import { setBackgroundGeolocationEnabled, backgroundPermissionDisclosed } from '../../App/actions'
import { selectIsAuthenticated } from '../../App/selectors'

// https://github.com/transistorsoft/rn-background-geolocation-demo/blob/1e63c8b5162c123c4961710d339bf9f9507a6893/src/home/HomeView.tsx#L156-L182
const willDiscloseBackgroundPermission = (hasDisclosedBackgroundPermission) => {

  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'android' || hasDisclosedBackgroundPermission) {
      return resolve()
    }

    // Show Play Store compatibility alert.
    Alert.alert(
      i18n.t('BACKGROUND_PERMISSION_DISCLOSURE.title'),
      i18n.t('BACKGROUND_PERMISSION_DISCLOSURE.message'),
      [
        {
          text: i18n.t('CLOSE'),
          onPress: resolve
        }
      ],
      {
        cancelable: true,
        onDismiss: resolve
      }
    )
  })
}

export default ({ getState, dispatch }) => {

  BackgroundGeolocation.onEnabledChange(isEnabled => {
    dispatch(setBackgroundGeolocationEnabled(isEnabled))
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

      BackgroundGeolocation.ready({
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        debug: __DEV__, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: __DEV__ ? BackgroundGeolocation.LOG_LEVEL_VERBOSE : BackgroundGeolocation.LOG_LEVEL_OFF,
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
        // Android options
        notification: {
          title: i18n.t('BACKGROUND_GEOLOCATION_NOTIFICATION_TITLE'),
          text: i18n.t('BACKGROUND_GEOLOCATION_NOTIFICATION_TEXT'),
        },
        allowIdenticalLocations: true,
        // https://support.google.com/googleplay/android-developer/answer/9799150
        // https://github.com/transistorsoft/react-native-background-geolocation/issues/1149
        // https://transistorsoft.github.io/react-native-background-geolocation-android/interfaces/_react_native_background_geolocation_android_.config.html#backgroundpermissionrationale
        // https://transistorsoft.medium.com/new-google-play-console-guidelines-for-sensitive-app-permissions-d9d2f4911353
        backgroundPermissionRationale: {
          title: i18n.t('BACKGROUND_PERMISSION_RATIONALE.title'),
          message: i18n.t('BACKGROUND_PERMISSION_RATIONALE.message'),
          positiveAction: i18n.t('BACKGROUND_PERMISSION_RATIONALE.positiveAction'),
          negativeAction: i18n.t('CANCEL')
        }
      }, (bgState) => {

        dispatch(setBackgroundGeolocationEnabled(bgState.enabled))

        willDiscloseBackgroundPermission(state.app.hasDisclosedBackgroundPermission)
          .then(() => {

            // This will be persisted in AsynStorage
            dispatch(backgroundPermissionDisclosed())

            if (!bgState.enabled) {
              BackgroundGeolocation.start(function() {
                if (__DEV__) {
                  // Manually toggles the SDK's motion state between stationary and moving.
                  // When provided a value of true, the plugin will engage location-services
                  // and begin aggressively tracking the device's location immediately, bypassing stationary monitoring.
                  setTimeout(() => BackgroundGeolocation.changePace(true), 5000)
                }
              })
            }
          })
      })

    } else {
      BackgroundGeolocation.stop()
      BackgroundGeolocation.removeListeners();
    }

    return result
  }
}
