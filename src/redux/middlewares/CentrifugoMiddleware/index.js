import Centrifuge from 'centrifuge';
import parseUrl from 'url-parse';

import {
  CENTRIFUGO_MESSAGE,
  CONNECT,
  CONNECTED,
  DISCONNECTED,
  connected,
  disconnected,
  message,
} from './actions';

import {
  selectBaseURL,
  selectHttpClient,
  selectHttpClientHasCredentials,
  selectIsAuthenticated,
  selectUser,
} from '../../App/selectors'
import { LOGOUT_SUCCESS } from '../../App/actions'

const isCentrifugoAction = ({ type }) => [CONNECT].some(x => x === type);

export default ({ getState, dispatch }) => {
  let centrifuge = null

  return (next) => (action) => {

    if (action.type === LOGOUT_SUCCESS) {
      const result = next(action)

      if (centrifuge && centrifuge.isConnected()) {
        centrifuge.disconnect()
        centrifuge = null
      }

      return result
    }

    if (!isCentrifugoAction(action)) {
      return next(action);
    }

    const state = getState();

    if (
      !selectIsAuthenticated(state) ||
      !selectHttpClientHasCredentials(state)
    ) {
      return next(action);
    }

    const httpClient = selectHttpClient(state)
    const baseURL = selectBaseURL(state)
    const user = selectUser(state)

    httpClient.get('/api/centrifugo/token').then(tokenResponse => {
      const url = parseUrl(baseURL);
      const protocol = url.protocol === 'https:' ? 'wss' : 'ws';

        centrifuge = new Centrifuge(`${protocol}://${url.hostname}/centrifugo/connection/websocket`, {
          debug: __DEV__,
          onRefresh: function (ctx, cb) {
            httpClient
              .post('/api/centrifugo/token/refresh')
              .then(refreshResponse => {
                // @see https://github.com/centrifugal/centrifuge-js#refreshendpoint
                // Data must be like {"status": 200, "data": {"token": "JWT"}} - see
                // type definitions in dist folder. Note that setting status to 200 is
                // required at moment. Any other status will result in refresh process
                // failure so client will eventually be disconnected by server.
                cb({ status: 200, data: { token: refreshResponse.token } });
              });
          },
        },
      );
      centrifuge.setToken(tokenResponse.token);

      centrifuge.on('connect', context => dispatch(connected(context)));
      centrifuge.on('disconnect', context => dispatch(disconnected(context)));

      centrifuge.subscribe(
        `${tokenResponse.namespace}_events#${user.username}`,
        msg => dispatch(message(msg.data.event)),
      );

      centrifuge.connect();
    });

    return next(action);
  };
};

export {
  CENTRIFUGO_MESSAGE,
  CONNECTED,
  DISCONNECTED,
  connected,
  disconnected,
}
