import Centrifuge from 'centrifuge';
import parseUrl from 'url-parse';

import {
  CENTRIFUGO_MESSAGE,
  centrifugoConnected,
  centrifugoDisconnected,
  connectCentrifugo,
  disconnectCentrifugo,
  message,
} from './actions';

import {
  selectBaseURL,
  selectHttpClient,
  selectHttpClientHasCredentials,
  selectIsAuthenticated,
  selectLoggedInUser,
  selectUser,
} from '../../App/selectors';
import { LOGOUT_SUCCESS, appStateChanged } from '../../App/actions';

function shouldManageConnectionBasedOnAppState(getState, action) {
  const state = getState();

  const user = selectLoggedInUser(state);

  if (!user) {
    return false;
  }

  // For now this method is used only for restaurant users
  return user.hasRole('ROLE_RESTAURANT');
}

function shouldConnectBasedOnAppState(getState, action) {
  if (!shouldManageConnectionBasedOnAppState(getState, action)) {
    return false;
  }

  if (action.type !== appStateChanged.type) {
    return false;
  }

  return action.payload === 'active';
}

function shouldDisconnectBasedOnAppState(getState, action) {
  if (!shouldManageConnectionBasedOnAppState(getState, action)) {
    return false;
  }

  if (action.type !== appStateChanged.type) {
    return false;
  }

  return action.payload !== 'active';
}

let centrifuge = null;
let subscription = null;

export default ({ getState, dispatch }) => {
  return next => action => {
    if (action.type === LOGOUT_SUCCESS) {
      dispatch(disconnectCentrifugo());
      return next(action);
    }

    if (
      action.type === connectCentrifugo.type ||
      shouldConnectBasedOnAppState(getState, action)
    ) {
      const state = getState();

      if (
        !selectIsAuthenticated(state) ||
        !selectHttpClientHasCredentials(state)
      ) {
        return next(action);
      }

      if (centrifuge && centrifuge.isConnected()) {
        return next(action);
      }

      const httpClient = selectHttpClient(state);
      const baseURL = selectBaseURL(state);
      const user = selectUser(state);

      httpClient.get('/api/centrifugo/token').then(tokenResponse => {
        const url = parseUrl(baseURL);
        const protocol = url.protocol === 'https:' ? 'wss' : 'ws';

        centrifuge = new Centrifuge(
          `${protocol}://${url.hostname}/centrifugo/connection/websocket`,
          {
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

        centrifuge.on('connect', context =>
          dispatch(centrifugoConnected(context)),
        );
        centrifuge.on('disconnect', context =>
          dispatch(centrifugoDisconnected(context)),
        );

        subscription = centrifuge.subscribe(
          `${tokenResponse.namespace}_events#${user.username}`,
          msg => dispatch(message(msg.data.event)),
        );

        centrifuge.connect();
      });

      return next(action);
    }

    if (
      action.type === disconnectCentrifugo.type ||
      shouldDisconnectBasedOnAppState(getState, action)
    ) {
      if (subscription) {
        subscription.unsubscribe();
        subscription.removeAllListeners();
        subscription = null;
      }

      if (centrifuge && centrifuge.isConnected()) {
        centrifuge.disconnect();
        centrifuge = null;
      }
      return next(action);
    }

    return next(action);
  };
};

export {
  CENTRIFUGO_MESSAGE,
  centrifugoConnected,
  centrifugoDisconnected,
  connectCentrifugo,
  disconnectCentrifugo,
};
