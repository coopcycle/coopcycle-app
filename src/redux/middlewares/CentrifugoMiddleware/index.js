import Centrifuge from 'centrifuge'
import parseUrl from 'url-parse'

import {
  CONNECT,
  CONNECTED,
  DISCONNECTED,
  MESSAGE,
  message,
  connected,
  disconnected,
} from './actions'

import {
  selectIsAuthenticated,
  selectHttpClient,
  selectHttpClientHasCredentials,
  selectUser, } from '../../App/selectors'

const isCentrifugoAction = ({ type }) =>
  [
    CONNECT,
  ].some((x) => x === type)

export default ({ getState, dispatch }) => {

  return (next) => (action) => {

    // TODO Run if connected

    if (!isCentrifugoAction(action)) {
      return next(action)
    }

    const state = getState()

    if (!selectIsAuthenticated(state) || !selectHttpClientHasCredentials(state)) {
      return next(action)
    }

    const httpClient = selectHttpClient(state)
    const baseURL = state.app.baseURL
    const user = selectUser(state)

    httpClient
      .get('/api/centrifugo/token')
      .then(res => {

        const url = parseUrl(baseURL)
        const protocol = url.protocol === 'https:' ? 'wss': 'ws'

        const centrifuge = new Centrifuge(`${protocol}://${url.hostname}/centrifugo/connection/websocket`, {
          debug: __DEV__,
        })
        centrifuge.setToken(res.token)

        centrifuge.on('connect', context => dispatch(connected(context)))
        centrifuge.on('disconnect', context => dispatch(disconnected(context)))

        centrifuge.subscribe(`${res.namespace}_events#${user.username}`, msg => dispatch(message(msg.data.event)))

        centrifuge.connect()

      })

    return next(action)
  }
}

export {
  MESSAGE,
  CONNECTED,
  DISCONNECTED,
  connected,
  disconnected
}
