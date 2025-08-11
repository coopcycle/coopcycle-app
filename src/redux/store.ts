import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import ReduxAsyncQueue from 'redux-async-queue';
import { persistStore } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import Config from 'react-native-config';

import reducers from './reducers';
import GeolocationMiddleware from './middlewares/GeolocationMiddleware';
import BluetoothMiddleware from './middlewares/BluetoothMiddleware';
import HttpMiddleware from './middlewares/HttpMiddleware';
import NetInfoMiddleware from './middlewares/NetInfoMiddleware';
import PushNotificationMiddleware from './middlewares/PushNotificationMiddleware';
import SentryMiddleware from './middlewares/SentryMiddleware';
import { ringOnTaskListUpdated } from './Courier/taskMiddlewares';
import CentrifugoMiddleware from './middlewares/CentrifugoMiddleware';
import { filterExpiredCarts } from './Checkout/middlewares';
import SoundMiddleware from './middlewares/SoundMiddleware';
import { notifyOnNewOrderCreated } from './Restaurant/middlewares';
import { apiSlice } from './api/slice';
import { setupListenersReactNative } from './setupListenersReactNative';
import AppStateMiddleware from './middlewares/AppStateMiddleware';

const middlewares = [
  ReduxAsyncQueue,
  NetInfoMiddleware,
  AppStateMiddleware,
  HttpMiddleware,
  apiSlice.middleware,
  PushNotificationMiddleware,
  CentrifugoMiddleware,
  SentryMiddleware,
  filterExpiredCarts,
  SoundMiddleware,
];

if (!Config.DEFAULT_SERVER) {
  middlewares.push(
    ...[
      GeolocationMiddleware,
      BluetoothMiddleware,
      notifyOnNewOrderCreated,
      ringOnTaskListUpdated,
    ],
  );
}

const middlewaresProxy = middlewaresList => {
  if (__DEV__) {
    return require('./devSetup.ts').middlewares(middlewaresList);
  } else {
    return middlewaresList;
  }
};

const enhancersProxy = enhancersList => {
  if (__DEV__) {
    return require('./devSetup.ts').enhancers(enhancersList);
  } else {
    return enhancersList;
  }
};

const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewaresProxy(middlewares)),
  enhancers: getDefaultEnhancers =>
    getDefaultEnhancers().concat(enhancersProxy([])),
});

// enable support for refetchOnFocus and refetchOnReconnect behaviors
// they are disabled by default and need to be enabled explicitly for each hook/action
// https://redux-toolkit.js.org/rtk-query/api/createApi#refetchonfocus
// https://redux-toolkit.js.org/rtk-query/api/setupListeners
setupListeners(store.dispatch);
setupListenersReactNative(store.dispatch, apiSlice.internalActions);

export default store;

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// TODO; replace with after migrating to react-redux v9.0
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// export const useAppSelector = useSelector.withTypes<RootState>()
