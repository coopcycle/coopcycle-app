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

// Whether a `/api/centrifugo/token` round trip is in flight. The
// `isConnected()` check below cannot see a client that has not been built yet,
// so without this every dispatch landing during that round trip would build a
// client of its own.
let isConnecting = false;

// Bumped whenever a connection is requested or torn down, so an in-flight token
// fetch whose response arrives after a newer connect — or after a logout — can
// tell that it is stale and drop its client instead of installing it.
let generation = 0;

/**
 * Drops the current client and subscription, if any.
 *
 * Deliberately *not* gated on `isConnected()`: a client that is merely
 * reconnecting is still very much alive — it holds a retry timer, still
 * delivers messages and still emits connect/disconnect — so skipping it left
 * one orphaned websocket behind per network blip, each one dispatching a
 * duplicate of every server event for the rest of the session.
 */
function teardown() {
  if (subscription) {
    subscription.unsubscribe();
    subscription.removeAllListeners();
    subscription = null;
  }

  if (centrifuge) {
    // Listeners go first: `disconnect()` emits, and the teardown of an old
    // client must not push a `centrifugoDisconnected` that would then be read
    // as the state of the client replacing it.
    centrifuge.removeAllListeners();
    centrifuge.disconnect();
    centrifuge = null;
  }
}

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

      if (isConnecting) {
        return next(action);
      }

      teardown();

      const thisGeneration = ++generation;
      isConnecting = true;

      const httpClient = selectHttpClient(state);
      const baseURL = selectBaseURL(state);
      const user = selectUser(state);

      httpClient
        .get('/api/centrifugo/token')
        .then(tokenResponse => {
          isConnecting = false;

          // A logout, or a newer connection request, happened while the token
          // was being fetched: this client is stale before it is even wired up.
          if (thisGeneration !== generation) {
            return;
          }

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
        })
        .catch(() => {
          isConnecting = false;

          if (thisGeneration !== generation) {
            return;
          }

          // Report the failure, otherwise `isCentrifugoConnecting` stays true
          // for good and nothing — not the restaurant retry button, not a
          // later connect — can get the connection back.
          dispatch(centrifugoDisconnected({ reason: 'token fetch failed' }));
        });

      return next(action);
    }

    if (
      action.type === disconnectCentrifugo.type ||
      shouldDisconnectBasedOnAppState(getState, action)
    ) {
      // Invalidates any connect still waiting on its token.
      generation++;
      isConnecting = false;

      teardown();

      // `teardown` unbinds the client's listeners before closing it, so the
      // store has to be told about a deliberate disconnect here.
      dispatch(centrifugoDisconnected({ reason: 'client' }));

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
