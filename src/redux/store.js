import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import ReduxAsyncQueue from 'redux-async-queue'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'

import { persistStore } from 'redux-persist'

import reducers from './reducers'
import GeolocationMiddleware from './middlewares/GeolocationMiddleware'
import BluetoothMiddleware from './middlewares/BluetoothMiddleware'
import HttpMiddleware from './middlewares/HttpMiddleware'
import NetInfoMiddleware from './middlewares/NetInfoMiddleware'
import PushNotificationMiddleware from './middlewares/PushNotificationMiddleware'
import SentryMiddleware from './middlewares/SentryMiddleware'
import { ringOnNewOrderCreated } from './Restaurant/middlewares'
import { ringOnTaskListUpdated } from './Courier/taskMiddlewares'
import CentrifugoMiddleware from './middlewares/CentrifugoMiddleware'
import { filterExpiredCarts } from './Checkout/middlewares';
import Config from 'react-native-config';
import createDebugger from 'redux-flipper'

const middlewares = [
  thunk,
  ReduxAsyncQueue,
  NetInfoMiddleware,
  HttpMiddleware,
  PushNotificationMiddleware,
  CentrifugoMiddleware,
  SentryMiddleware,
  filterExpiredCarts,
]

if (!Config.DEFAULT_SERVER) {
  middlewares.push(...[
    GeolocationMiddleware,
    BluetoothMiddleware,
    ringOnNewOrderCreated,
    ringOnTaskListUpdated,
  ])
}

if (process.env.NODE_ENV === 'development') {
  // middlewares.push(createLogger({ collapsed: true }));
  middlewares.push(createDebugger());
}

const middlewaresProxy = (middlewaresList) => {
  if (process.env.NODE_ENV === 'development') {
    return composeWithDevTools(applyMiddleware(...middlewaresList))
  } else {
    return applyMiddleware(...middlewaresList)
  }
}

const store = createStore(
  reducers,
  middlewaresProxy(middlewares)
)

export default store

export const persistor = persistStore(store)
