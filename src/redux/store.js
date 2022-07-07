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
import {restaurantsSearchIndex} from './Checkout/middlewares';

const middlewares = [
  thunk,
  ReduxAsyncQueue,
  NetInfoMiddleware,
  HttpMiddleware,
  PushNotificationMiddleware,
  CentrifugoMiddleware,
  SentryMiddleware,
  restaurantsSearchIndex,
]

if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger({ collapsed: true }))
}

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middlewares))
)

export default store

export const persistor = persistStore(store)
