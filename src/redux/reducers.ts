/*
 * Combined reducer for all state-slices
 *
 * Redux state is organised into domains, entities, and ui-related state
 *
 * The `entities` sub-tree is used a little like a NoSQL database to record
 * the main entities the application is concerned with: Tasks, Orders,
 * Restaurants, Couriers, Tours, etc.
 *
 * The `ui` sub-tree stores state fragments related only to the appearance
 * of the UI, and which have no impact or relation to the `entities`.
 *
 * The `app` sub-tree stores state fragments that are non-domain specific,
 * like the server URL, or a flag indicating the WS connection status.
 *
 * Initial state-shapes are provided in each individual reducer file.
 */
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reduceReducers from 'reduce-reducers';

import { apiSlice } from './api/slice';
import { appReducer } from './App';
import { createTaskItemsTransform } from './util';
import {
  dateReducer as coreDateReducer,
  taskEntityReducers as coreTaskEntityReducers,
  taskListEntityReducers as coreTaskListEntityReducers,
  uiReducers as coreUiReducers,
} from '../coopcycle-frontend-js/logistics/redux';

import { tasksEntityReducer, tasksUiReducer } from './Courier';
import accountReducer from './Account/reducers';
import appDateReducer from './logistics/dateReducer';
import appDispatchReducer from './Dispatch/reducers';
import appUiReducers from './logistics/uiReducers';
import appTaskEntityReducers from './logistics/taskEntityReducers';
import appTaskListEntityReducers from './logistics/taskListEntityReducers';
import appTourEntityReducers from './logistics/tourEntityReducers';
import checkoutReducer from './Checkout/reducers';
import deliveryReducer from './Delivery/reducers';
import restaurantReducer from './Restaurant/reducers';
import storeReducer from './Store/reducers';
import keywordFiltersReducer from './Dispatch/keywordFiltersSlice';
import selectedTasksReducer from './Dispatch/updateSelectedTasksSlice';

const taskEntitiesPersistConfig = {
  key: 'entities.items',
  storage: AsyncStorage,
  whitelist: ['items'],
  transforms: [createTaskItemsTransform()],
};

const restaurantPersistConfig = {
  key: 'restaurant',
  storage: AsyncStorage,
  whitelist: ['myRestaurants', 'restaurant', 'printer', 'preferences'],
};

const tasksUiPersistConfig = {
  key: 'ui.tasks',
  version: 0,
  storage: AsyncStorage,
  whitelist: [
    'excludeFilters',
    'tasksChangedAlertSound',
    'keepAwake',
    'isHideUnassignedFromMap',
    'isPolylineOn',
    'signatureScreenFirst',
  ],
  migrate: state => {
    if (!state) {
      return new Promise((resolve, reject) => {
        try {
          AsyncStorage.multiGet([
            '@Settings.keepAwake',
            '@Preferences.signatureScreenFirst',
            '@Preferences.tasksFilters',
          ]).then(values => {
            let [keepAwake, signatureScreenFirst, tasksFilters] = values;

            let keepAwakeValue = keepAwake[1]
              ? JSON.parse(keepAwake[1])
              : false;
            let signatureScreenFirstValue = signatureScreenFirst[1]
              ? JSON.parse(signatureScreenFirst[1])
              : false;
            let tasksFiltersValue = tasksFilters[1]
              ? JSON.parse(tasksFilters[1])
              : [];

            AsyncStorage.removeItem('@Settings.keepAwake');
            AsyncStorage.removeItem('@Preferences.signatureScreenFirst');
            AsyncStorage.removeItem('@Preferences.tasksFilters');

            resolve({
              keepAwake: keepAwakeValue,
              signatureScreenFirst: signatureScreenFirstValue,
              excludeFilters: tasksFiltersValue,
            });
          });
        } catch (e) {
          resolve({
            keepAwake: false,
            signatureScreenFirst: false,
            excludeFilters: [],
            tasksChangedAlertSound: true,
          });
        }
      });
    }

    return Promise.resolve(state);
  },
};

const appPersistConfig = {
  key: 'app',
  version: 0,
  storage: AsyncStorage,
  whitelist: [
    'baseURL',
    'settings',
    'pushNotificationToken',
    'hasDisclosedBackgroundPermission',
    'firstRun',
    'resumeCheckoutAfterActivation',
    'isSpinnerDelayEnabled',
    'isBarcodeEnabled',
  ],
  migrate: state => {
    if (!state) {
      return new Promise((resolve, reject) => {
        try {
          AsyncStorage.getItem('@Server').then((data, error) => {
            if (error) {
              return resolve(null);
            }

            AsyncStorage.removeItem('@Server');

            return resolve({
              baseURL: data,
            });
          });
        } catch (e) {
          resolve({
            baseURL: null,
          });
        }
      });
    }

    return Promise.resolve(state);
  },
};

const checkoutPersistConfig = {
  key: 'checkout',
  storage: AsyncStorage,
  whitelist: [
    'showMultipleServersInSameCityModal',
    'carts',
    'address',
    'stripePaymentMethods',
  ],
};

export default combineReducers({
  entities: combineReducers({
    tasks: persistReducer(taskEntitiesPersistConfig, tasksEntityReducer),
  }),
  app: persistReducer(appPersistConfig, appReducer),
  [apiSlice.reducerPath]: apiSlice.reducer,
  account: accountReducer,
  delivery: deliveryReducer,
  restaurant: persistReducer(restaurantPersistConfig, restaurantReducer),
  store: storeReducer,
  checkout: persistReducer(checkoutPersistConfig, checkoutReducer),
  ui: combineReducers({
    tasks: persistReducer(tasksUiPersistConfig, tasksUiReducer),
  }),
  //todo move more properties from appDispatchReducer into `logistics` state
  dispatch: combineReducers({
    ...appDispatchReducer,
    ui: combineReducers({
      keywordFilters: keywordFiltersReducer,
      selectedTasks: selectedTasksReducer,
    }),
  }),
  logistics: combineReducers({
    date: reduceReducers(coreDateReducer, appDateReducer),
    entities: combineReducers({
      tasks: reduceReducers(coreTaskEntityReducers, appTaskEntityReducers),
      taskLists: reduceReducers(
        coreTaskListEntityReducers,
        appTaskListEntityReducers,
      ),
      tours: appTourEntityReducers,
    }),
    ui: reduceReducers(coreUiReducers, appUiReducers),
  }),
});
