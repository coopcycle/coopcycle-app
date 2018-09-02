import {
  LOAD_ORDERS_REQUEST,
  LOAD_ORDERS_FAILURE,
  LOAD_ORDERS_SUCCESS,
  ACCEPT_ORDER_REQUEST,
  ACCEPT_ORDER_SUCCESS,
  ACCEPT_ORDER_FAILURE,
  REFUSE_ORDER_REQUEST,
  REFUSE_ORDER_SUCCESS,
  REFUSE_ORDER_FAILURE,
  DELAY_ORDER_REQUEST,
  DELAY_ORDER_SUCCESS,
  DELAY_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
  LOAD_MY_RESTAURANTS_REQUEST,
  LOAD_MY_RESTAURANTS_SUCCESS,
  LOAD_MY_RESTAURANTS_FAILURE,
  CHANGE_STATUS_REQUEST,
  CHANGE_STATUS_SUCCESS,
  CHANGE_STATUS_FAILURE,
  CHANGE_RESTAURANT,
  CHANGE_DATE,
} from './actions'

import moment from 'moment'
import _ from 'lodash'

const initialState = {
  fetchError: null,  // Error object describing the error
  isFetching: false, // Flag indicating active HTTP request
  orders: [],        // Array of orders
  myRestaurants: [], // Array of restaurants
  date: moment(),
  status: 'available',
  restaurant: null
}

const spliceOrders = (state, payload) => {

  const orderIndex = _.findIndex(state.orders, order => order['@id'] === payload['@id'])

  if (-1 !== orderIndex) {
    const newOrders = state.orders.slice(0)
    newOrders.splice(orderIndex, 1, Object.assign({}, payload))

    return newOrders
  }

  return state.orders
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case LOAD_ORDERS_REQUEST:
    case ACCEPT_ORDER_REQUEST:
    case LOAD_MY_RESTAURANTS_REQUEST:
    case REFUSE_ORDER_REQUEST:
    case DELAY_ORDER_REQUEST:
    case CANCEL_ORDER_REQUEST:
    case CHANGE_STATUS_REQUEST:
      return {
        ...state,
        fetchError: false,
        isFetching: true,
      }

    case LOAD_ORDERS_FAILURE:
    case ACCEPT_ORDER_FAILURE:
    case LOAD_MY_RESTAURANTS_FAILURE:
    case REFUSE_ORDER_FAILURE:
    case DELAY_ORDER_FAILURE:
    case CANCEL_ORDER_FAILURE:
    case CHANGE_STATUS_FAILURE:
      return {
        ...state,
        fetchError: action.payload || action.error,
        isFetching: false,
      }

    case LOAD_ORDERS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        orders: action.payload,
      }

    case ACCEPT_ORDER_SUCCESS:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        fetchError: false,
        isFetching: false,
      }

    case REFUSE_ORDER_SUCCESS:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        fetchError: false,
        isFetching: false,
      }

    case DELAY_ORDER_SUCCESS:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        fetchError: false,
        isFetching: false,
      }

    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        fetchError: false,
        isFetching: false,
      }

    case LOAD_MY_RESTAURANTS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        myRestaurants: action.payload,
        // We select by default the first restaurant from the list
        // Most of the time, users will own only one restaurant
        restaurant: _.first(action.payload),
      }

    case CHANGE_STATUS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: action.payload
      }

    case CHANGE_RESTAURANT:
      return {
        ...state,
        restaurant: action.payload
      }

    case CHANGE_DATE:
      return {
        ...state,
        date: action.payload
      }

    default:
      return { ...state }
  }
}
