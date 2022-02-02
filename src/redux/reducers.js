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
import {
  dateReducer as coreDateReducer,
  taskEntityReducers as coreTaskEntityReducers,
  taskListEntityReducers as coreTaskListEntityReducers,
  uiReducers as coreUiReducers,
} from '../coopcycle-frontend-js/logistics/redux'
import appDispatchReducer from './Dispatch/reducers'
import appDateReducer from './logistics/dateReducer'
import appTaskEntityReducers from './logistics/taskEntityReducers'
import appTaskListEntityReducers from './logistics/taskListEntityReducers'
import appLastmileUiReducers from './logistics/uiReducers'
import storeReducer from './Store/reducers'
import { createTaskItemsTransform } from './util'
import reduceReducers from 'reduce-reducers';

const taskEntitiesPersistConfig = {
  key: 'entities.items',
  storage: AsyncStorage,
  whitelist: ['items'],
  transforms: [ createTaskItemsTransform() ],
}

const restaurantPersistConfig = {
  key: 'restaurant',
  storage: AsyncStorage,
  whitelist: ['myRestaurants', 'restaurant', 'printer'],
}

const tasksUiPersistConfig = {
  key: 'ui.tasks',
  version: 0,
  storage: AsyncStorage,
  whitelist: ['excludeFilters', 'tasksChangedAlertSound', 'keepAwake', 'signatureScreenFirst'],
  migrate: (state) => {

    if (!state) {

      return new Promise((resolve, reject) => {
        try {

          AsyncStorage.multiGet([
            '@Settings.keepAwake',
            '@Preferences.signatureScreenFirst',
            '@Preferences.tasksFilters',
          ]).then(values => {

            let [ keepAwake, signatureScreenFirst, tasksFilters ] = values

            let keepAwakeValue = keepAwake[1] ? JSON.parse(keepAwake[1]) : false
            let signatureScreenFirstValue = signatureScreenFirst[1] ? JSON.parse(signatureScreenFirst[1]) : false
            let tasksFiltersValue = tasksFilters[1] ? JSON.parse(tasksFilters[1]) : []

            AsyncStorage.removeItem('@Settings.keepAwake')
            AsyncStorage.removeItem('@Preferences.signatureScreenFirst')
            AsyncStorage.removeItem('@Preferences.tasksFilters')

            resolve({
              keepAwake: keepAwakeValue,
              signatureScreenFirst: signatureScreenFirstValue,
              excludeFilters: tasksFiltersValue,
            })

          })

        } catch (e) {
          resolve({
            keepAwake: false,
            signatureScreenFirst: false,
            excludeFilters: [],
            tasksChangedAlertSound: true,
          })
        }
      })
    }

    return Promise.resolve(state)
  },
}

const appPersistConfig = {
  key: 'app',
  version: 0,
  storage: AsyncStorage,
  whitelist: ['baseURL', 'settings', 'pushNotificationToken', 'hasDisclosedBackgroundPermission'],
  migrate: (state) => {

    if (!state) {

      return new Promise((resolve, reject) => {
        try {

          AsyncStorage.getItem('@Server')
            .then((data, error) => {
              if (error) {
                return resolve(null)
              }

              AsyncStorage.removeItem('@Server')

              return resolve({
                baseURL: data,
              })
            })

        } catch (e) {
          resolve({
            baseURL: null,
          })
        }
      })

    }

    return Promise.resolve(state)
  },
}

const checkoutPersisteConfig = {
  key: 'checkout',
  storage: AsyncStorage,
  whitelist: ['showMultipleServersInSameCityModal'],
}

export default combineReducers({
  entities: combineReducers({
    tasks: persistReducer(taskEntitiesPersistConfig, tasksEntityReducer),
  }),
  app: persistReducer(appPersistConfig, appReducer),
  account: accountReducer,
  restaurant: persistReducer(restaurantPersistConfig, restaurantReducer),
  store: storeReducer,
  checkout: persistReducer(checkoutPersisteConfig, checkoutReducer),
  ui: combineReducers({
    tasks: persistReducer(tasksUiPersistConfig, tasksUiReducer),
  }),
  //todo move more properties from appDispatchReducer into `logistics` state
  dispatch: appDispatchReducer,
  logistics: combineReducers({
    date: reduceReducers(coreDateReducer, appDateReducer),
    entities: combineReducers({
      tasks: reduceReducers(coreTaskEntityReducers, appTaskEntityReducers),
      taskLists: reduceReducers(coreTaskListEntityReducers, appTaskListEntityReducers),
    }),
    ui: reduceReducers(coreUiReducers, appLastmileUiReducers),
  }),
})
