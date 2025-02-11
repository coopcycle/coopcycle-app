import {
  CREATE_DELIVERY_SUCCESS,
  INIT_SUCCESS,
  LOAD_DELIVERIES_SUCCESS,
  LOAD_PACKAGES_SUCCESS,
  LOAD_TASKS_SUCCESS,
  LOAD_TIME_SLOTS_SUCCESS,
  LOAD_TIME_SLOT_CHOICES_SUCCESS,
  SET_LOADING_MORE,
  SET_REFRESHING,
} from './actions';

import { LOAD_MY_STORES_SUCCESS } from '../App/actions';

import { composeWithState } from '../../utils/delivery';

import _ from 'lodash';

const initialState = {
  fetchError: null, // Error object describing the error
  myStores: [], // Array of stores
  store: null,
  deliveries: [],
  pagination: {
    next: null,
    totalItems: 0,
  },
  loadingMore: false,
  refreshing: false,
  timeSlots: [],
  choices: [],
  price: null,
  priceExcludingTax: null,
};

const replace = (deliveries, delivery, pickup, dropoff) => {
  const index = _.findIndex(deliveries, d => d['@id'] === delivery['@id']);

  if (index !== -1) {
    const newDeliveries = deliveries.slice(0);
    newDeliveries.splice(
      index,
      1,
      composeWithState({ ...delivery, pickup, dropoff }),
    );

    return newDeliveries;
  }

  return deliveries;
};

export default (state = initialState, action = {}) => {
  let newState;

  switch (action.type) {
    case INIT_SUCCESS:
      if (action.payload.store['@id'] === state.store['@id']) {
        return {
          ...state,
          deliveries: _.uniqBy(
            state.deliveries.concat(
              _.map(action.payload.deliveries, d => composeWithState(d)),
            ),
            '@id',
          ),
          pagination: action.payload.pagination,
        };
      }

      break;

    case LOAD_DELIVERIES_SUCCESS:
      const { store, deliveries, pagination } = action.payload;

      if (store['@id'] === state.store['@id']) {
        return {
          ...state,
          deliveries: _.uniqBy(
            state.deliveries.concat(
              _.map(deliveries, d => composeWithState(d)),
            ),
            '@id',
          ),
          pagination,
        };
      }

      break;

    case CREATE_DELIVERY_SUCCESS:
      const newDeliveries = state.deliveries.slice();
      newDeliveries.unshift(action.payload);

      return {
        ...state,
        deliveries: _.uniqBy(newDeliveries, '@id'),
      };

    case LOAD_MY_STORES_SUCCESS:
      newState = {
        ...state,
        fetchError: false,
        myStores: action.payload,
      };

      if (action.payload.length > 0) {
        newState = {
          ...newState,
          // We select by default the first restaurant from the list
          // Most of the time, users will own only one restaurant
          store: _.first(action.payload),
        };
      }

      return newState;

    case LOAD_TIME_SLOT_CHOICES_SUCCESS:
      return {
        ...state,
        choices: action.payload,
      };

    case LOAD_TIME_SLOTS_SUCCESS:
      return {
        ...state,
        timeSlots: action.payload,
      };

    case LOAD_PACKAGES_SUCCESS:
      return {
        ...state,
        packages: action.payload,
      };

    case LOAD_TASKS_SUCCESS:
      const { delivery, pickup, dropoff } = action.payload;

      return {
        ...state,
        deliveries: replace(state.deliveries, delivery, pickup, dropoff),
      };

    case SET_LOADING_MORE:
      return {
        ...state,
        loadingMore: action.payload,
      };

    case SET_REFRESHING:
      return {
        ...state,
        refreshing: action.payload,
      };
  }

  return state;
};
