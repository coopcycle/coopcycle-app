/*
 * Combined reducer for all state-slices
 *
 * Redux state is organised into domains, entities, and ui-related state
 *
 * The `entities` sub-tree is used a little like a NoSQL database to record
 * the main entities the application is concerned with: Tasks, Orders,
 * Restaurants, Couriers, etc.
 *
 * The `ui` sub-tree stores state fragments related only to the appearance
 * of the UI, and which have no impact or relation to the `entities`.
 *
 * The `app` sub-tree stores state fragments that are non-domain specific,
 * like the server URL, or a flag indicating the WS connection status.
 *
 * Initial state-shapes are provided in each individual reducer file.
 */
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'

import { tasksEntityReducer, tasksUiReducer } from './Courier'
import { appReducer } from './App'
import accountReducer from './Account/reducers'
import restaurantReducer from './Restaurant/reducers'
import checkoutReducer from './Checkout/reducers'
import dispatchReducer from './Dispatch/reducers'
import storeReducer from './Store/reducers'

const taskEntitiesPersistConfig = {
  key: 'entities.items',
  storage: AsyncStorage,
  whitelist: ['items']
}

export default combineReducers({
  entities: combineReducers({
    tasks: persistReducer(taskEntitiesPersistConfig, tasksEntityReducer),
  }),
  app: appReducer,
  account: accountReducer,
  restaurant: restaurantReducer,
  store: storeReducer,
  checkout: checkoutReducer,
  dispatch: dispatchReducer,
  ui: combineReducers({
    tasks: tasksUiReducer,
  }),
})
