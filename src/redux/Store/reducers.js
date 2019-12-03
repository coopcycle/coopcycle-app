import {
  CREATE_DELIVERY_SUCCESS,
  LOAD_DELIVERIES_SUCCESS,
  LOAD_TIME_SLOT_SUCCESS,
  LOAD_TASKS_SUCCESS,
  ASSERT_DELIVERY_ERROR,
  SET_LOADING_MORE,
  SET_REFRESHING,
} from './actions'

import {
  LOAD_MY_STORES_SUCCESS,
} from '../App/actions'

import { composeWithState } from '../../utils/delivery'

import _ from 'lodash'

const initialState = {
  fetchError: null,  // Error object describing the error
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
  assertDeliveryError: null,
}

const replace = (deliveries, delivery, pickup, dropoff) => {

  const index = _.findIndex(deliveries, d => d['@id'] === delivery['@id'])

  if (index !== -1) {
    const newDeliveries = deliveries.slice(0)
    newDeliveries.splice(index, 1, composeWithState({ ...delivery, pickup, dropoff }))

    return newDeliveries
  }

  return deliveries
}

export default (state = initialState, action = {}) => {
  let newState

  switch (action.type) {
    case LOAD_DELIVERIES_SUCCESS:

      const { store, deliveries, pagination } = action.payload

      if (store['@id'] === state.store['@id']) {

        return {
          ...state,
          deliveries: _.uniqBy(state.deliveries.concat(deliveries), '@id'),
          pagination,
        }
      }

      break

    case CREATE_DELIVERY_SUCCESS:

      const newDeliveries = state.deliveries.slice()
      newDeliveries.unshift(action.payload)

      return {
        ...state,
        deliveries: _.uniqBy(newDeliveries, '@id'),
      }

    case LOAD_MY_STORES_SUCCESS:

      newState = {
        ...state,
        fetchError: false,
        myStores: action.payload,
      }

      if (action.payload.length > 0) {
        newState = {
          ...newState,
          // We select by default the first restaurant from the list
          // Most of the time, users will own only one restaurant
          store: _.first(action.payload),
        }
      }

      return newState

    case LOAD_TIME_SLOT_SUCCESS:

      const timeSlots = state.timeSlots.slice()
      timeSlots.push(action.payload)

      return {
        ...state,
        timeSlots,
      }

    case LOAD_TASKS_SUCCESS:

      const { delivery, pickup, dropoff } = action.payload

      return {
        ...state,
        deliveries: replace(state.deliveries, delivery, pickup, dropoff),
      }

    case ASSERT_DELIVERY_ERROR:

      return {
        ...state,
        assertDeliveryError: action.payload,
      }

    case SET_LOADING_MORE:

      return {
        ...state,
        loadingMore: action.payload,
      }

    case SET_REFRESHING:

      return {
        ...state,
        refreshing: action.payload,
      }
  }

  return state
}
