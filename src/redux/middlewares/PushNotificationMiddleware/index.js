import { Platform } from 'react-native'
import { savePushNotificationTokenSuccess } from '../../App/actions'
import {
  selectIsAuthenticated,
  selectHttpClient,
  selectHttpClientHasCredentials
} from '../../App/selectors'

let isFetching = false

// As remote push notifications are configured very early,
// most of the time the user won't be authenticated
// (for example, when app is launched for the first time)
// We store the token for later, when the user authenticates
export default ({ getState, dispatch }) => {

  return (next) => (action) => {

    const result = next(action)
    const state = getState()

    if (!state.app.pushNotificationToken) {
      return result
    }

    if (selectIsAuthenticated(state) && selectHttpClientHasCredentials(state)) {

      if (isFetching) {
        return result
      }

      isFetching = true

      const httpClient = selectHttpClient(state)

      httpClient
        .post('/api/me/remote_push_tokens', { platform: Platform.OS, token: state.app.pushNotificationToken })
        .then(() => dispatch(savePushNotificationTokenSuccess()))
        .catch(e => console.log(e))
        .finally(() => {
          isFetching = false
        })
    }

    return result
  }
}
