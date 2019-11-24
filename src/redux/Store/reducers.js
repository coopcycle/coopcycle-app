import {
  LOAD_MY_STORES_SUCCESS,
  CREATE_DELIVERY_SUCCESS,
  LOAD_DELIVERIES_SUCCESS,
  LOAD_TIME_SLOT_SUCCESS,
  LOAD_DELIVERY_SUCCESS,
  CLEAR_DELIVERY,
  ASSERT_DELIVERY_ERROR,
  SET_LOADING_MORE,
} from './actions'

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
  timeSlots: [],
  delivery: null,
  assertDeliveryError: null,
}

export default (state = initialState, action = {}) => {
  let newState

  switch (action.type) {
    case LOAD_DELIVERIES_SUCCESS:

      const { store, deliveries, pagination } = action.payload

      if (store['@id'] === state.store['@id']) {

        return {
          ...state,
          deliveries: state.deliveries.concat(deliveries),
          pagination,
        }
      }

      break

    case CREATE_DELIVERY_SUCCESS:

      const newDeliveries = state.deliveries.slice()
      newDeliveries.unshift(action.payload)

      return {
        ...state,
        deliveries: newDeliveries,
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

    case LOAD_DELIVERY_SUCCESS:

      return {
        ...state,
        delivery: action.payload,
      }

    case CLEAR_DELIVERY:

      return {
        ...state,
        delivery: null,
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
  }

  return state
}
