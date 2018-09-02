import { createAction } from 'redux-actions'

/*
 * Action Types
 */
export const LOAD_MY_RESTAURANTS_REQUEST = 'LOAD_MY_RESTAURANTS_REQUEST'
export const LOAD_MY_RESTAURANTS_SUCCESS = 'LOAD_MY_RESTAURANTS_SUCCESS'
export const LOAD_MY_RESTAURANTS_FAILURE = 'LOAD_MY_RESTAURANTS_FAILURE'

export const LOAD_ORDERS_REQUEST = 'LOAD_ORDERS_REQUEST'
export const LOAD_ORDERS_SUCCESS = 'LOAD_ORDERS_SUCCESS'
export const LOAD_ORDERS_FAILURE = 'LOAD_ORDERS_FAILURE'

export const ACCEPT_ORDER_REQUEST = 'ACCEPT_ORDER_REQUEST'
export const ACCEPT_ORDER_SUCCESS = 'ACCEPT_ORDER_SUCCESS'
export const ACCEPT_ORDER_FAILURE = 'ACCEPT_ORDER_FAILURE'

export const REFUSE_ORDER_REQUEST = 'REFUSE_ORDER_REQUEST'
export const REFUSE_ORDER_SUCCESS = 'REFUSE_ORDER_SUCCESS'
export const REFUSE_ORDER_FAILURE = 'REFUSE_ORDER_FAILURE'

export const DELAY_ORDER_REQUEST = 'DELAY_ORDER_REQUEST'
export const DELAY_ORDER_SUCCESS = 'DELAY_ORDER_SUCCESS'
export const DELAY_ORDER_FAILURE = 'DELAY_ORDER_FAILURE'

export const CANCEL_ORDER_REQUEST = 'CANCEL_ORDER_REQUEST'
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS'
export const CANCEL_ORDER_FAILURE = 'CANCEL_ORDER_FAILURE'

export const CHANGE_STATUS_REQUEST = 'CHANGE_STATUS_REQUEST'
export const CHANGE_STATUS_SUCCESS = 'CHANGE_STATUS_SUCCESS'
export const CHANGE_STATUS_FAILURE = 'CHANGE_STATUS_FAILURE'

export const CHANGE_RESTAURANT = 'CHANGE_RESTAURANT'
export const CHANGE_DATE = 'CHANGE_DATE'

/*
 * Action Creators
 */
export const loadMyRestaurantsRequest = createAction(LOAD_MY_RESTAURANTS_REQUEST)
export const loadMyRestaurantsSuccess = createAction(LOAD_MY_RESTAURANTS_SUCCESS)
export const loadMyRestaurantsFailure = createAction(LOAD_MY_RESTAURANTS_FAILURE)

export const loadOrdersRequest = createAction(LOAD_ORDERS_REQUEST)
export const loadOrdersSuccess = createAction(LOAD_ORDERS_SUCCESS)
export const loadOrdersFailure = createAction(LOAD_ORDERS_FAILURE)

export const acceptOrderRequest = createAction(ACCEPT_ORDER_REQUEST)
export const acceptOrderSuccess = createAction(ACCEPT_ORDER_SUCCESS)
export const acceptOrderFailure = createAction(ACCEPT_ORDER_FAILURE)

export const refuseOrderRequest = createAction(REFUSE_ORDER_REQUEST)
export const refuseOrderSuccess = createAction(REFUSE_ORDER_SUCCESS)
export const refuseOrderFailure = createAction(REFUSE_ORDER_FAILURE)

export const delayOrderRequest = createAction(DELAY_ORDER_REQUEST)
export const delayOrderSuccess = createAction(DELAY_ORDER_SUCCESS)
export const delayOrderFailure = createAction(DELAY_ORDER_FAILURE)

export const cancelOrderRequest = createAction(CANCEL_ORDER_REQUEST)
export const cancelOrderSuccess = createAction(CANCEL_ORDER_SUCCESS)
export const cancelOrderFailure = createAction(CANCEL_ORDER_FAILURE)

export const changeStatusRequest = createAction(CHANGE_STATUS_REQUEST)
export const changeStatusSuccess = createAction(CHANGE_STATUS_SUCCESS)
export const changeStatusFailure = createAction(CHANGE_STATUS_FAILURE)

export const changeRestaurant = createAction(CHANGE_RESTAURANT)
export const changeDate = createAction(CHANGE_DATE)

/*
 * Thunk Creators
 */

export function loadMyRestaurants(client) {

  return function (dispatch) {
    dispatch(loadMyRestaurantsRequest())

    return client.get('/api/me/restaurants')
      .then(res => dispatch(loadMyRestaurantsSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadMyRestaurantsFailure(e)))
  }
}

export function loadOrders(client, restaurant, date) {

  return function (dispatch) {
    dispatch(loadOrdersRequest())

    return client.get(`${restaurant['@id']}/orders?date=${date}`)
      .then(res => dispatch(loadOrdersSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadOrdersFailure(e)))
  }
}

export function acceptOrder(client, order) {

  return function (dispatch) {
    dispatch(acceptOrderRequest())

    return client.put(order['@id'] + '/accept')
      .then(res => dispatch(acceptOrderSuccess(res)))
      .catch(e => dispatch(acceptOrderFailure(e)))
  }
}

export function refuseOrder(client, order, reason) {

  return function (dispatch) {
    dispatch(refuseOrderRequest())

    return client.put(order['@id'] + '/refuse', { reason })
      .then(res => dispatch(refuseOrderSuccess(res)))
      .catch(e => dispatch(refuseOrderFailure(e)))
  }
}

export function delayOrder(client, order, delay) {

  return function (dispatch) {
    dispatch(delayOrderRequest())

    return client.put(order['@id'] + '/delay', { delay })
      .then(res => dispatch(delayOrderSuccess(res)))
      .catch(e => dispatch(delayOrderFailure(e)))
  }
}

export function cancelOrder(client, order, reason) {

  return function (dispatch) {
    dispatch(cancelOrderRequest())

    return client.put(order['@id'] + '/cancel', { reason })
      .then(res => dispatch(cancelOrderSuccess(res)))
      .catch(e => dispatch(cancelOrderFailure(e)))
  }
}

export function changeStatus(client, restaurant, state) {

  return function (dispatch) {
    dispatch(changeStatusRequest())

    return client.put(restaurant['@id'], { state })
      .then(res => dispatch(changeStatusSuccess(res)))
      .catch(e => dispatch(changeStatusFailure(e)))
  }
}
