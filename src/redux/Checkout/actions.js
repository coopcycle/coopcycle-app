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
export const SET_DATE = '@checkout/SET_DATE'
export const CLEAR = '@checkout/CLEAR'

export const INIT_REQUEST = '@checkout/INIT_REQUEST'
export const INIT_SUCCESS = '@checkout/INIT_SUCCESS'
export const INIT_FAILURE = '@checkout/INIT_FAILURE'

export const SEARCH_RESTAURANTS_REQUEST = '@checkout/SEARCH_RESTAURANTS_REQUEST'
export const SEARCH_RESTAURANTS_SUCCESS = '@checkout/SEARCH_RESTAURANTS_SUCCESS'
export const SEARCH_RESTAURANTS_FAILURE = '@checkout/SEARCH_RESTAURANTS_FAILURE'

export const CHECKOUT_REQUEST = '@checkout/CHECKOUT_REQUEST'
export const CHECKOUT_SUCCESS = '@checkout/CHECKOUT_SUCCESS'
export const CHECKOUT_FAILURE = '@checkout/CHECKOUT_FAILURE'

/*
 * Action Creators
 */

export const addItem = createAction(ADD_ITEM, (item, options = []) => ({ item, options }))
export const removeItem = createAction(REMOVE_ITEM)
export const incrementItem = createAction(INCREMENT_ITEM)
export const decrementItem = createAction(DECREMENT_ITEM)
export const setAddress = createAction(SET_ADDRESS)
export const setDate = createAction(SET_DATE)
export const clear = createAction(CLEAR)

export const initRequest = createAction(INIT_REQUEST)
export const initSuccess = createAction(INIT_SUCCESS)
export const initFailure = createAction(INIT_FAILURE)

export const searchRestaurantsRequest = createAction(SEARCH_RESTAURANTS_REQUEST)
export const searchRestaurantsSuccess = createAction(SEARCH_RESTAURANTS_SUCCESS)
export const searchRestaurantsFailure = createAction(SEARCH_RESTAURANTS_FAILURE)

export const checkoutRequest = createAction(CHECKOUT_REQUEST)
export const checkoutSuccess = createAction(CHECKOUT_SUCCESS)
export const checkoutFailure = createAction(CHECKOUT_FAILURE)

export function searchRestaurants(latitude, longitude) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app

    dispatch(searchRestaurantsRequest())

    httpClient.get('/api/restaurants?coordinate=' + [ latitude, longitude ])
      .then(res => {
        dispatch(searchRestaurantsSuccess(res['hydra:member']))
      })
      .catch(e => dispatch(searchRestaurantsFailure(e)))
  }
}

export function init(restaurant) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app

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
