import { createAction } from 'redux-actions'

import API from '../../../API'
import { SET_HTTP_CLIENT, SET_USER, AUTHENTICATION_SUCCESS } from '../../App/actions'
import { REHYDRATE } from 'redux-persist'

const setHttpClient = createAction(SET_HTTP_CLIENT)

export default ({ getState, dispatch }) => {

  return (next) => (action) => {

    const prevState = getState()
    const result = next(action)
    const state = getState()

    const hasBaseURLChanged = prevState.app.baseURL !== state.app.baseURL
    const hasUserChanged = prevState.app.user !== state.app.user
    const hasAuthenticationChanged = prevState.app.isAuthenticated !== state.app.isAuthenticated

    if (hasBaseURLChanged || hasUserChanged || hasAuthenticationChanged) {
      if (state.app.baseURL) {
        const httpClient = API.createClient(state.app.baseURL, state.app.user)
        dispatch(setHttpClient(httpClient))
      } else {
        dispatch(setHttpClient(null))
      }
    }

    return result
  }
}
