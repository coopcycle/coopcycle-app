import { createAction } from 'redux-actions'
import { NavigationActions, StackActions } from 'react-navigation'

import DropdownHolder from '../../DropdownHolder'
import NavigationHolder from '../../NavigationHolder'

/*
 * Action Types
 */

export const LOAD_MY_RESTAURANTS_REQUEST = 'LOAD_MY_RESTAURANTS_REQUEST'
export const LOAD_MY_RESTAURANTS_SUCCESS = 'LOAD_MY_RESTAURANTS_SUCCESS'
export const LOAD_MY_RESTAURANTS_FAILURE = 'LOAD_MY_RESTAURANTS_FAILURE'

export const LOAD_ORDERS_REQUEST = 'LOAD_ORDERS_REQUEST'
export const LOAD_ORDERS_SUCCESS = 'LOAD_ORDERS_SUCCESS'
export const LOAD_ORDERS_FAILURE = 'LOAD_ORDERS_FAILURE'

export const LOAD_ORDER_REQUEST = 'LOAD_ORDER_REQUEST'
export const LOAD_ORDER_SUCCESS = 'LOAD_ORDER_SUCCESS'
export const LOAD_ORDER_FAILURE = 'LOAD_ORDER_FAILURE'

export const SET_CURRENT_ORDER = 'SET_CURRENT_ORDER'

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

export const LOAD_PRODUCTS_REQUEST = 'LOAD_PRODUCTS_REQUEST'
export const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS'
export const LOAD_PRODUCTS_FAILURE = 'LOAD_PRODUCTS_FAILURE'

export const CHANGE_PRODUCT_ENABLED_REQUEST = 'CHANGE_PRODUCT_ENABLED_REQUEST'
export const CHANGE_PRODUCT_ENABLED_SUCCESS = 'CHANGE_PRODUCT_ENABLED_SUCCESS'
export const CHANGE_PRODUCT_ENABLED_FAILURE = 'CHANGE_PRODUCT_ENABLED_FAILURE'

export const CLOSE_RESTAURANT_REQUEST = 'CLOSE_RESTAURANT_REQUEST'
export const CLOSE_RESTAURANT_SUCCESS = 'CLOSE_RESTAURANT_SUCCESS'
export const CLOSE_RESTAURANT_FAILURE = 'CLOSE_RESTAURANT_FAILURE'

export const DELETE_OPENING_HOURS_SPECIFICATION_REQUEST = 'DELETE_OPENING_HOURS_SPECIFICATION_REQUEST'
export const DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS = 'DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS'
export const DELETE_OPENING_HOURS_SPECIFICATION_FAILURE = 'DELETE_OPENING_HOURS_SPECIFICATION_FAILURE'

/*
 * Action Creators
 */

export const loadMyRestaurantsRequest = createAction(LOAD_MY_RESTAURANTS_REQUEST)
export const loadMyRestaurantsSuccess = createAction(LOAD_MY_RESTAURANTS_SUCCESS)
export const loadMyRestaurantsFailure = createAction(LOAD_MY_RESTAURANTS_FAILURE)

export const loadOrdersRequest = createAction(LOAD_ORDERS_REQUEST)
export const loadOrdersSuccess = createAction(LOAD_ORDERS_SUCCESS)
export const loadOrdersFailure = createAction(LOAD_ORDERS_FAILURE)

export const loadOrderRequest = createAction(LOAD_ORDER_REQUEST)
export const loadOrderSuccess = createAction(LOAD_ORDER_SUCCESS)
export const loadOrderFailure = createAction(LOAD_ORDER_FAILURE)

export const setCurrentOrder = createAction(SET_CURRENT_ORDER)

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

export const loadProductsRequest = createAction(LOAD_PRODUCTS_REQUEST)
export const loadProductsSuccess = createAction(LOAD_PRODUCTS_SUCCESS)
export const loadProductsFailure = createAction(LOAD_PRODUCTS_FAILURE)

export const changeProductEnabledRequest = createAction(CHANGE_PRODUCT_ENABLED_REQUEST)
export const changeProductEnabledSuccess = createAction(CHANGE_PRODUCT_ENABLED_SUCCESS)
export const changeProductEnabledFailure = createAction(CHANGE_PRODUCT_ENABLED_FAILURE)

export const closeRestaurantRequest = createAction(CLOSE_RESTAURANT_REQUEST)
export const closeRestaurantSuccess = createAction(CLOSE_RESTAURANT_SUCCESS)
export const closeRestaurantFailure = createAction(CLOSE_RESTAURANT_FAILURE)

export const deleteOpeningHoursSpecificationRequest = createAction(DELETE_OPENING_HOURS_SPECIFICATION_REQUEST)
export const deleteOpeningHoursSpecificationSuccess = createAction(DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS)
export const deleteOpeningHoursSpecificationFailure = createAction(DELETE_OPENING_HOURS_SPECIFICATION_FAILURE)

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

export function loadOrderAndNavigate(order) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(loadOrderRequest())

    return httpClient.get(order)
      .then(res => {

        dispatch(loadOrderSuccess(res))

        // We use the "Reset" action so that it works everywhere
        const resetAction = StackActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({
              routeName: 'RestaurantHome',
              params: {
                restaurant: res.restaurant,
                // We don't want to load orders again when navigating
                loadOrders: false
              }
            }),
            NavigationActions.navigate({
              routeName: 'RestaurantOrder',
              params: { order: res }
            }),
          ]
        })

        NavigationHolder.dispatch(resetAction)

      })
      .catch(e => dispatch(loadOrderFailure(e)))
  }
}

export function acceptOrder(client, order) {

  return function (dispatch) {
    dispatch(acceptOrderRequest())

    return client.put(order['@id'] + '/accept')
      .then(res => {

        dispatch(acceptOrderSuccess(res))

        DropdownHolder
          .getDropdown()
          .alertWithType('success', 'Commande acceptée !',
            `La commande ${order.number} (#${order.id}) a été acceptée`
          )

      })
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
      .then(res => {

        dispatch(cancelOrderSuccess(res))

        DropdownHolder
          .getDropdown()
          .alertWithType('success', 'Commande annulée !',
            `La commande ${order.number} (#${order.id}) a été annulée`
          )

      })
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

export function loadProducts(client, restaurant) {

  return function (dispatch) {
    dispatch(loadProductsRequest())

    return client.get(`${restaurant['@id']}/products`)
      .then(res => dispatch(loadProductsSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadProductsFailure(e)))
  }
}

export function changeProductEnabled(client, product, enabled) {

  return function (dispatch) {
    dispatch(changeProductEnabledRequest())

    return client.put(product['@id'], { enabled })
      .then(res => dispatch(changeProductEnabledSuccess(res)))
      .catch(e => dispatch(changeProductEnabledFailure(e)))
  }
}

export function closeRestaurant(client, restaurant) {

  return function (dispatch) {
    dispatch(closeRestaurantRequest())

    return client.put(`${restaurant['@id']}/close`, {})
      .then(res => dispatch(closeRestaurantSuccess(res)))
      .catch(e => dispatch(closeRestaurantFailure(e)))
  }
}

export function deleteOpeningHoursSpecification(client, openingHoursSpecification) {

  return function (dispatch) {
    dispatch(deleteOpeningHoursSpecificationRequest())

    return client.delete(openingHoursSpecification['@id'])
      .then(res => dispatch(deleteOpeningHoursSpecificationSuccess(openingHoursSpecification)))
      .catch(e => dispatch(deleteOpeningHoursSpecificationFailure(e)))
  }
}
