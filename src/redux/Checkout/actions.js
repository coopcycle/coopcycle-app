import { createAction } from 'redux-actions'

/*
 * Action Types
 */
export const INIT = 'CHECKOUT_INIT'
export const ADD_ITEM = 'ADD_ITEM'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const INCREMENT_ITEM = 'INCREMENT_ITEM'
export const DECREMENT_ITEM = 'DECREMENT_ITEM'
export const SET_ADDRESS_RESOURCE = 'SET_ADDRESS_RESOURCE'
export const CLEAR = 'CHECKOUT_CLEAR'

export const SEARCH_RESTAURANTS_REQUEST = '@checkout/SEARCH_RESTAURANTS_REQUEST'
export const SEARCH_RESTAURANTS_SUCCESS = '@checkout/SEARCH_RESTAURANTS_SUCCESS'
export const SEARCH_RESTAURANTS_FAILURE = '@checkout/SEARCH_RESTAURANTS_FAILURE'

/*
 * Action Creators
 */
export const init = createAction(INIT, (restaurant, address, date) => ({ restaurant, address, date }))
export const addItem = createAction(ADD_ITEM, (item, options = []) => ({ item, options }))
export const removeItem = createAction(REMOVE_ITEM)
export const incrementItem = createAction(INCREMENT_ITEM)
export const decrementItem = createAction(DECREMENT_ITEM)
export const setAddressResource = createAction(SET_ADDRESS_RESOURCE)
export const clear = createAction(CLEAR)

export const searchRestaurantsRequest = createAction(SEARCH_RESTAURANTS_REQUEST)
export const searchRestaurantsSuccess = createAction(SEARCH_RESTAURANTS_SUCCESS)
export const searchRestaurantsFailure = createAction(SEARCH_RESTAURANTS_FAILURE)

export function searchRestaurants(latitude, longitude, date) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app

    dispatch(searchRestaurantsRequest())

    httpClient.get('/api/restaurants?coordinate=' + [latitude, longitude])
      .then(res => {

        const restaurants = res['hydra:member']

        Promise
          .all(restaurants.map(restaurant => {
            // Load from API if this is an IRI
            if (typeof restaurant.hasMenu === 'string') {

              return httpClient.get(restaurant.hasMenu)
            }

            return new Promise((resolve, reject) => resolve(restaurant.hasMenu))
          }))
          .then(values => restaurants.map((restaurant, key) => ({ ...restaurant, hasMenu: values[key] })))
          .then(restaurantsWithMenu => {
            if (date) {

              return _.filter(restaurantsWithMenu, restaurant => {
                for (let i = 0; i < restaurant.availabilities.length; i++) {
                  if (moment(restaurant.availabilities[i]).isSame(date, 'day')) {

                    return true
                  }
                }

                return false
              })
            }

            return restaurantsWithMenu
          })
          .then(restaurantsWithMenu => {
            dispatch(searchRestaurantsSuccess(restaurantsWithMenu))
          })
      })
  }
}
