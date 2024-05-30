import { applyMiddleware, createStore } from 'redux';
import ReduxAsyncQueue from 'redux-async-queue';
import { composeWithDevTools } from 'redux-devtools-extension';
// import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { persistStore } from 'redux-persist';

import Config from 'react-native-config';
// import { filterExpiredCarts } from './Checkout/middlewares';
// import { ringOnTaskListUpdated } from './Courier/taskMiddlewares';
// import { ringOnNewOrderCreated } from './Restaurant/middlewares';
// import BluetoothMiddleware from './middlewares/BluetoothMiddleware';
// import CentrifugoMiddleware from './middlewares/CentrifugoMiddleware';
// import GeolocationMiddleware from './middlewares/GeolocationMiddleware';
// import HttpMiddleware from './middlewares/HttpMiddleware';
// import NetInfoMiddleware from './middlewares/NetInfoMiddleware';
// import PushNotificationMiddleware from './middlewares/PushNotificationMiddleware';
import SentryMiddleware from './middlewares/SentryMiddleware';
import tempWebReducers from './tempWebReducers';
import API from '@/src/API';
import AppUser from '@/src/AppUser';

const middlewares = [
  thunk,
  ReduxAsyncQueue,
  // NetInfoMiddleware,
  // HttpMiddleware,
  // PushNotificationMiddleware,
  // CentrifugoMiddleware,
  SentryMiddleware,
  // filterExpiredCarts,
];

if (!Config.DEFAULT_SERVER) {
  middlewares.push(
    ...[
      // GeolocationMiddleware,
      // BluetoothMiddleware,
      // ringOnNewOrderCreated,
      // ringOnTaskListUpdated,
    ],
  );
}

// if (__DEV__) {
//   middlewares.push(createLogger({ collapsed: true }));
// }

const middlewaresProxy = middlewaresList => {
  if (__DEV__) {
    return composeWithDevTools(
      applyMiddleware(...middlewaresList),
      // require('../../ReactotronConfig').default.createEnhancer(),
    );
  } else {
    return applyMiddleware(...middlewaresList);
  }
};

//TODO; POC ONLY
const httpClient = API.createClient('http://localhost', {
  token: 'TODO: PUT YOUR TOKEN',
  refreshToken: 'TODO: PUT YOUR REFRESH TOKEN',
  // onCredentialsUpdated: credentials => {
  //   const user = new AppUser(
  //     credentials.username,
  //     credentials.email,
  //     credentials.token,
  //     credentials.roles,
  //     credentials.refreshToken,
  //     credentials.enabled,
  //   );
  //
  //   dispatch(setUser(user));
  //
  //   user.save().then(() => console.log('Credentials saved!'));
  // },
  // onTokenRefreshed: (token, refreshToken) => {
  //   const { username, email, roles, enabled } = state.app.user;
  //
  //   const user = new AppUser(
  //     username,
  //     email,
  //     token,
  //     roles,
  //     refreshToken,
  //     enabled,
  //   );
  //
  //   dispatch(setUser(user));
  //
  //   user.save().then(() => console.log('Credentials saved!'));
  // },
});

const preloadedState = {
  app: {
    httpClient: httpClient,
  },
  store: {
    store: {
      '@id': '/api/stores/1',
      '@type': 'http://schema.org/Store',
      name: 'Wakuli',
      enabled: false,
      address: {
        '@id': '/api/addresses/54',
        '@type': 'http://schema.org/Place',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 48.808922,
          longitude: 2.363575,
        },
        streetAddress: '3, Rue René Cassin, 94270, Le Kremlin-Bicêtre, France',
        telephone: '+33112121212',
        name: 'Wakuli',
      },
      timeSlot: null,
    },
    deliveries: [],
  },
};

const store = createStore(
  tempWebReducers,
  preloadedState,
  middlewaresProxy(middlewares),
);

export default store;

export const persistor = persistStore(store);
