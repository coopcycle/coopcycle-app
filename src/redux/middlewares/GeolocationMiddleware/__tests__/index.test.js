import BackgroundGeolocation from 'react-native-background-geolocation';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createAction } from 'redux-actions';

import AppUser from '../../../../AppUser';
import { SET_USER } from '../../../../redux/App/actions';
import appReducer from '../../../../redux/App/reducers';
import middleware from '../index';

const setUser = createAction(SET_USER);

// This needs to be defined here to be "mockable"

let onEnabledChangeCallback;
BackgroundGeolocation.onEnabledChange.mockImplementation(callback => {
  onEnabledChangeCallback = callback;
});

// As we may be using setTimeout(), we need to mock timers
// @see https://jestjs.io/docs/en/timer-mocks.html
jest.useFakeTimers({ legacyFakeTimers: true });

// v5's ready()/start() are promise-only, so the middleware now does its work in
// microtasks. Let them drain before asserting.
const flushPromises = () => new Promise(resolve => process.nextTick(resolve));

describe('GeolocationMiddleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not start background geolocation if already started', async () => {
    BackgroundGeolocation.ready.mockResolvedValue({ enabled: true });

    const preloadedState = {
      app: {
        baseURL: 'https://demo.coopcycle.org',
        user: null,
        isBackgroundGeolocationEnabled: true,
      },
    };

    const reducer = combineReducers({
      app: appReducer,
    });

    const store = configureStore({
      reducer,
      preloadedState,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat([middleware]),
    });

    const user = new AppUser('foo', 'foo@coopcycle.org', '123456', [
      'ROLE_COURIER',
    ]);
    store.dispatch(setUser({ ...user }));
    await flushPromises();

    expect(BackgroundGeolocation.ready).toHaveBeenCalledTimes(1);
    expect(BackgroundGeolocation.start).toHaveBeenCalledTimes(0);

    const newState = store.getState();

    expect(newState.app.isBackgroundGeolocationEnabled).toBe(true);
  });

  it('starts background geolocation if not started', async () => {
    // Change Jest timeout limit,
    // because we are calling changePace with setTimeout
    jest.setTimeout(30000);

    const preloadedState = {
      app: {
        baseURL: 'https://demo.coopcycle.org',
        user: null,
        hasDisclosedBackgroundPermission: true,
      },
    };

    const reducer = combineReducers({
      app: appReducer,
    });

    const store = configureStore({
      reducer,
      preloadedState,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat([middleware]),
    });

    BackgroundGeolocation.ready.mockResolvedValue({ enabled: false });
    BackgroundGeolocation.start.mockImplementation(() => {
      onEnabledChangeCallback(true);
      return Promise.resolve({ enabled: true });
    });

    const user = new AppUser('foo', 'foo@coopcycle.org', '123456', [
      'ROLE_COURIER',
    ]);

    store.dispatch(setUser({ ...user }));

    // ready() -> willDiscloseBackgroundPermission() -> start()
    await flushPromises();
    // changePace() is called from a setTimeout in the start() continuation
    jest.runAllTimers();
    await flushPromises();

    expect(BackgroundGeolocation.ready).toHaveBeenCalledTimes(1);
    expect(BackgroundGeolocation.start).toHaveBeenCalledTimes(1);
    expect(BackgroundGeolocation.changePace).toHaveBeenCalledWith(true);

    const newState = store.getState();

    expect(newState.app.isBackgroundGeolocationEnabled).toBe(true);
  });

  it('stops background geolocation on logout', async () => {
    BackgroundGeolocation.stop.mockImplementation(() => {
      onEnabledChangeCallback(false);
    });

    const user = new AppUser('foo', 'foo@coopcycle.org', '123456', [
      'ROLE_COURIER',
    ]);

    const preloadedState = {
      app: {
        baseURL: 'https://demo.coopcycle.org',
        user,
      },
    };

    const reducer = combineReducers({
      app: appReducer,
    });

    const store = configureStore({
      reducer,
      preloadedState,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat([middleware]),
    });

    store.dispatch(setUser(null));

    expect(BackgroundGeolocation.stop).toHaveBeenCalledTimes(1);
    expect(BackgroundGeolocation.removeListeners).toHaveBeenCalledTimes(1);

    const newState = store.getState();

    expect(newState.app.isBackgroundGeolocationEnabled).toBe(false);
  });
});
