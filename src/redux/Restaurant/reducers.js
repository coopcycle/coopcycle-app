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
  LOAD_MY_RESTAURANTS_REQUEST,
  LOAD_MY_RESTAURANTS_SUCCESS,
  LOAD_MY_RESTAURANTS_FAILURE,
  CHANGE_DATE,
  CHANGE_STATUS,
} from './actions'
import moment from 'moment'

const initialState = {
  fetchError: null,  // Error object describing the error
  isFetching: false, // Flag indicating active HTTP request
  orders: [],        // Array of orders
  myRestaurants: [], // Array of restaurants
  date: moment(),
  status: 'available'
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
      return {
        ...state,
        fetchError: false,
        isFetching: true,
      }

    case LOAD_ORDERS_FAILURE:
    case ACCEPT_ORDER_FAILURE:
    case LOAD_MY_RESTAURANTS_FAILURE:
    case REFUSE_ORDER_FAILURE:
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

    case LOAD_MY_RESTAURANTS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        myRestaurants: action.payload
      }

    case CHANGE_DATE:
      return {
        ...state,
        date: action.payload
      }

    case CHANGE_STATUS:
      return {
        ...state,
        status: action.payload
      }

    default:
      return { ...state }
  }
}
