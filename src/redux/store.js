import { applyMiddleware, createStore } from 'redux';
import ReduxAsyncQueue from 'redux-async-queue';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { persistStore } from 'redux-persist';

import Config from 'react-native-config';
import { filterExpiredCarts } from './Checkout/middlewares';
import { ringOnTaskListUpdated } from './Courier/taskMiddlewares';
import { ringOnNewOrderCreated } from './Restaurant/middlewares';
import BluetoothMiddleware from './middlewares/BluetoothMiddleware';
import CentrifugoMiddleware from './middlewares/CentrifugoMiddleware';
import GeolocationMiddleware from './middlewares/GeolocationMiddleware';
import HttpMiddleware from './middlewares/HttpMiddleware';
import NetInfoMiddleware from './middlewares/NetInfoMiddleware';
import PushNotificationMiddleware from './middlewares/PushNotificationMiddleware';
import SentryMiddleware from './middlewares/SentryMiddleware';
import reducers from './reducers';

const middlewares = [
  thunk,
  ReduxAsyncQueue,
  NetInfoMiddleware,
  HttpMiddleware,
  PushNotificationMiddleware,
  CentrifugoMiddleware,
  SentryMiddleware,
  filterExpiredCarts,
];

if (!Config.DEFAULT_SERVER) {
  middlewares.push(
    ...[
      GeolocationMiddleware,
      BluetoothMiddleware,
      ringOnNewOrderCreated,
      ringOnTaskListUpdated,
    ],
  );
}

if (__DEV__) {
  middlewares.push(createLogger({ collapsed: true }));
}

const middlewaresProxy = middlewaresList => {
  if (__DEV__) {
    return composeWithDevTools(
      applyMiddleware(...middlewaresList),
      require('../../ReactotronConfig').default.createEnhancer(),
    );
  } else {
    return applyMiddleware(...middlewaresList);
  }
};

const store = createStore(reducers, middlewaresProxy(middlewares));

export default store;

export const persistor = persistStore(store);
