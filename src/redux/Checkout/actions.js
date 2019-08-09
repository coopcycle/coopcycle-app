import { createAction } from 'redux-actions'
import { StackActions, NavigationActions } from 'react-navigation'
import Stripe from 'tipsi-stripe'

import NavigationHolder from '../../NavigationHolder'
import Settings from '../../Settings'

/*
 * Action Types
 */

export const ADD_ITEM = 'ADD_ITEM'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const INCREMENT_ITEM = 'INCREMENT_ITEM'
export const DECREMENT_ITEM = 'DECREMENT_ITEM'
export const SET_ADDRESS = '@checkout/SET_ADDRESS'
export const SET_ADDRESS_OK = '@checkout/SET_ADDRESS_OK'
export const SET_DATE = '@checkout/SET_DATE'
export const CLEAR = '@checkout/CLEAR'

export const INIT_REQUEST = '@checkout/INIT_REQUEST'
export const INIT_SUCCESS = '@checkout/INIT_SUCCESS'
export const INIT_FAILURE = '@checkout/INIT_FAILURE'

export const LOAD_RESTAURANTS_REQUEST = '@checkout/LOAD_RESTAURANTS_REQUEST'
export const LOAD_RESTAURANTS_SUCCESS = '@checkout/LOAD_RESTAURANTS_SUCCESS'
export const LOAD_RESTAURANTS_FAILURE = '@checkout/LOAD_RESTAURANTS_FAILURE'

export const CHECKOUT_REQUEST = '@checkout/CHECKOUT_REQUEST'
export const CHECKOUT_SUCCESS = '@checkout/CHECKOUT_SUCCESS'
export const CHECKOUT_FAILURE = '@checkout/CHECKOUT_FAILURE'

export const SHOW_ADDRESS_MODAL = '@checkout/SHOW_ADDRESS_MODAL'
export const HIDE_ADDRESS_MODAL = '@checkout/HIDE_ADDRESS_MODAL'

/*
 * Action Creators
 */

export const removeItem = createAction(REMOVE_ITEM)
export const incrementItem = createAction(INCREMENT_ITEM)
export const decrementItem = createAction(DECREMENT_ITEM)
export const setDate = createAction(SET_DATE)
export const clear = createAction(CLEAR)
export const setAddressOK = createAction(SET_ADDRESS_OK)

export const initRequest = createAction(INIT_REQUEST)
export const initSuccess = createAction(INIT_SUCCESS)
export const initFailure = createAction(INIT_FAILURE)

export const loadRestaurantsRequest = createAction(LOAD_RESTAURANTS_REQUEST)
export const loadRestaurantsSuccess = createAction(LOAD_RESTAURANTS_SUCCESS)
export const loadRestaurantsFailure = createAction(LOAD_RESTAURANTS_FAILURE)

export const checkoutRequest = createAction(CHECKOUT_REQUEST)
export const checkoutSuccess = createAction(CHECKOUT_SUCCESS)
export const checkoutFailure = createAction(CHECKOUT_FAILURE)

export const showAddressModal = createAction(SHOW_ADDRESS_MODAL)
export const hideAddressModal = createAction(HIDE_ADDRESS_MODAL)

function validateAddress(httpClient, restaurant, address) {
  const latitude = address.geo.latitude
  const longitude = address.geo.longitude

  return httpClient.get(`/api/restaurants/${restaurant.id}/can-deliver/${latitude},${longitude}`)
}

const _addItem = createAction(ADD_ITEM, (item, options = []) => ({ item, options }))

let setAddressListeners = []

function addSetAddressListener(cb) {
  setAddressListeners.push(cb)
}

function onSetAddress(address) {
  setAddressListeners.forEach(callback => callback(address))
  setAddressListeners = []
}

export function addItem(item, options = []) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app
    const { address, cart, isAddressOK } = getState().checkout

    if (!address || !isAddressOK) {

      if (address && null === isAddressOK) {
        validateAddress(httpClient, cart.restaurant, address)
          .then(() => {
            dispatch(_setAddress(address))
            dispatch(setAddressOK(true))
            dispatch(_addItem(item, options))
            dispatch(hideAddressModal())
          })
          .catch(() => {
            dispatch(setAddressOK(false))
            dispatch(showAddressModal())
          })
      } else {
        addSetAddressListener(() => {
          dispatch(_addItem(item, options))
        })
        dispatch(showAddressModal())
      }

      return
    }

    if (item.hasOwnProperty('menuAddOn') && Array.isArray(item.menuAddOn) && item.menuAddOn.length > 0) {
      NavigationHolder.navigate('CheckoutProductOptions', { product: item })
      return
    }

    dispatch(_addItem(item, options))
  }
}

export const addItemWithOptions = createAction(ADD_ITEM, (item, options = []) => ({ item, options }))

const _setAddress = createAction(SET_ADDRESS)

export function setAddress(address) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app
    const { cart } = getState().checkout

    validateAddress(httpClient, cart.restaurant, address)
      .then(() => {
        dispatch(_setAddress(address))
        onSetAddress(address)

        dispatch(setAddressOK(true))
        dispatch(hideAddressModal())
      })
      .catch(() => {
        dispatch(setAddressOK(false))
      })
  }
}

export function searchRestaurants(options) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app

    let queryString = ''
    if (options && options.hasOwnProperty('latitude') && options.hasOwnProperty('longitude')) {
      queryString = `coordinate=${options.latitude},${options.longitude}`
    }

    dispatch(loadRestaurantsRequest())

    httpClient.get('/api/restaurants' + (queryString ? `?${queryString}` : ''))
      .then(res => {
        dispatch(loadRestaurantsSuccess(res['hydra:member']))
      })
      .catch(e => dispatch(loadRestaurantsFailure(e)))
  }
}

export function init(restaurant) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app
    const { address } = getState().checkout

    dispatch(initRequest(restaurant))

    if (typeof restaurant.hasMenu === 'string') {

      httpClient.get(restaurant.hasMenu)
        .then((menu) => {
          const restaurantWithMenu = { ...restaurant, hasMenu: menu }
          dispatch(initSuccess(restaurantWithMenu))
        })
        .catch(e => dispatch(initFailure(e)))
    }
  }
}

export function checkout(number, expMonth, expYear, cvc) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app
    const { address, cart, date } = getState().checkout

    Stripe.setOptions({
      publishableKey: Settings.get('stripe_publishable_key'),
    })

    const newCart = cart.clone()
    newCart.setDeliveryAddress(address)
    newCart.setDeliveryDate(date)

    dispatch(checkoutRequest())

    Stripe.createTokenWithCard({
      number,
      expMonth: parseInt(expMonth, 10),
      expYear: parseInt(expYear, 10),
      cvc
    })
    .then(token => {
      httpClient
        .post('/api/orders', newCart.toJSON())
        .then(order => httpClient.put(order['@id'] + '/pay', { stripeToken: token.tokenId }))
        .then(order => {

          // First, reset checkout stack
          NavigationHolder.dispatch(StackActions.popToTop())
          // Then, navigate to order screen
          NavigationHolder.dispatch(NavigationActions.navigate({
            routeName: 'AccountNav',
            // We skip the AccountOrders screen
            action: NavigationActions.navigate({
              routeName: 'AccountOrder',
              params: { order }
            }),
          }))

          // Make sure to clear AFTER navigation has been reset
          dispatch(clear())
          dispatch(checkoutSuccess(order))

        })
        .catch(e => dispatch(checkoutFailure(e)))
    })
    .catch(err => console.log(err));

  }
}
