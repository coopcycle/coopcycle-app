import { combineReducers, configureStore } from '@reduxjs/toolkit';

jest.mock('../../../../services/httpClientService', () => ({
  httpClientService: {
    getClient: jest.fn(),
  },
}));

// Every client the middleware builds, in creation order, so a test can assert
// on the ones it was supposed to have thrown away.
let mockClients = [];

jest.mock('centrifuge', () => {
  const State = { Disconnected: 'disconnected', Connecting: 'connecting', Connected: 'connected' };

  const Centrifuge = jest.fn().mockImplementation(() => {
    const subscriptions = {};

    const client = {
      // From v3 on the client reports a state rather than answering
      // isConnected().
      state: State.Disconnected,
      listeners: {},
      on: jest.fn(function (event, cb) {
        this.listeners[event] = cb;
      }),
      getSubscription: jest.fn(channel => subscriptions[channel] ?? null),
      newSubscription: jest.fn(channel => {
        subscriptions[channel] = {
          on: jest.fn(),
          subscribe: jest.fn(),
          unsubscribe: jest.fn(),
          removeAllListeners: jest.fn(),
        };

        return subscriptions[channel];
      }),
      removeSubscription: jest.fn(sub => {
        Object.keys(subscriptions).forEach(channel => {
          if (subscriptions[channel] === sub) {
            delete subscriptions[channel];
          }
        });
      }),
      connect: jest.fn(function () {
        this.state = State.Connected;
        this.listeners.connected?.({ client: 'a-client-id' });
      }),
      disconnect: jest.fn(function () {
        this.state = State.Disconnected;
      }),
      removeAllListeners: jest.fn(),
    };

    mockClients.push(client);

    return client;
  });

  return { Centrifuge, State, __esModule: true };
});

// Lets the middleware's `/api/centrifugo/token` promise settle.
function flush() {
  return new Promise(resolve => setImmediate(resolve));
}

/**
 * Simulates a network blip: the client drops and centrifuge-js begins
 * auto-reconnecting, which is the state in which it reports itself as not
 * connected while still being very much alive.
 */
function drop(client) {
  client.state = 'disconnected';
  client.listeners.disconnected?.({
    reason: 'connection closed',
    reconnect: true,
  });
}

describe('CentrifugoMiddleware', () => {
  let connectCentrifugo;
  let disconnectCentrifugo;
  let tokenRequests;
  let buildStore;

  beforeEach(() => {
    // The middleware keeps its client in module scope, so each test needs its
    // own copy of the module.
    jest.resetModules();
    jest.clearAllMocks();
    mockClients = [];
    tokenRequests = 0;

    const actions = require('../actions');
    connectCentrifugo = actions.connectCentrifugo;
    disconnectCentrifugo = actions.disconnectCentrifugo;

    // Required after `resetModules`, so this is the instance the middleware
    // will read.
    const {
      httpClientService,
    } = require('../../../../services/httpClientService');

    httpClientService.getClient.mockReturnValue({
      getToken: () => 'jwt',
      get: jest.fn(() => {
        tokenRequests++;
        return Promise.resolve({ token: 'ws-jwt', namespace: 'demo' });
      }),
      post: jest.fn(() => Promise.resolve({ token: 'ws-jwt' })),
    });

    const appReducer = require('../../../App/reducers').default;
    const middleware = require('../index').default;
    const reducer = combineReducers({ app: appReducer });

    buildStore = () =>
      configureStore({
        reducer,
        preloadedState: {
          app: {
            ...reducer(undefined, { type: '@@INIT' }).app,
            baseURL: 'https://demo.coopcycle.org',
            user: {
              username: 'bob',
              email: 'bob@example.org',
              token: 'jwt',
              roles: ['ROLE_COURIER'],
              refreshToken: 'refresh',
              enabled: true,
              guest: false,
            },
          },
        },
        middleware: getDefaultMiddleware =>
          getDefaultMiddleware({ serializableCheck: false }).concat(middleware),
      });
  });

  it('connects once and marks the store connected', async () => {
    const store = buildStore();

    store.dispatch(connectCentrifugo());
    await flush();

    expect(mockClients).toHaveLength(1);
    expect(mockClients[0].connect).toHaveBeenCalled();
    expect(store.getState().app.isCentrifugoConnected).toBe(true);
  });

  it('does not build a second client when already connected', async () => {
    const store = buildStore();

    store.dispatch(connectCentrifugo());
    await flush();
    store.dispatch(connectCentrifugo());
    await flush();

    expect(mockClients).toHaveLength(1);
  });

  // The regression: a reconnect request used to leave the dropped client alive
  // and auto-reconnecting, leaking one websocket — and one duplicate of every
  // server event — per network blip.
  it('tears the dropped client down before replacing it', async () => {
    const store = buildStore();

    store.dispatch(connectCentrifugo());
    await flush();

    const first = mockClients[0];
    drop(first);
    expect(store.getState().app.isCentrifugoConnected).toBe(false);

    store.dispatch(connectCentrifugo());
    await flush();

    expect(mockClients).toHaveLength(2);
    expect(first.removeAllListeners).toHaveBeenCalled();
    expect(first.disconnect).toHaveBeenCalled();
  });

  it('builds only one client for connects racing the token request', async () => {
    const store = buildStore();

    store.dispatch(connectCentrifugo());
    store.dispatch(connectCentrifugo());
    store.dispatch(connectCentrifugo());
    await flush();

    expect(tokenRequests).toBe(1);
    expect(mockClients).toHaveLength(1);
  });

  it('tears down a client that is reconnecting rather than connected', async () => {
    const store = buildStore();

    store.dispatch(connectCentrifugo());
    await flush();

    const first = mockClients[0];
    drop(first);

    store.dispatch(disconnectCentrifugo());

    expect(first.disconnect).toHaveBeenCalled();
    expect(store.getState().app.isCentrifugoConnected).toBe(false);
  });

  it('leaves nothing installed when a logout races the token request', async () => {
    const store = buildStore();

    store.dispatch(connectCentrifugo());
    store.dispatch(disconnectCentrifugo());
    await flush();

    expect(mockClients).toHaveLength(0);
    expect(store.getState().app.isCentrifugoConnected).toBe(false);
  });
});
