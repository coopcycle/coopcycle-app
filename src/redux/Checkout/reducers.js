import {
  INIT_REQUEST,
  INIT_SUCCESS,
  INIT_FAILURE,
  ADD_ITEM,
  REMOVE_ITEM,
  INCREMENT_ITEM,
  DECREMENT_ITEM,
  SET_ADDRESS,
  CLEAR,
  SEARCH_RESTAURANTS_REQUEST,
  SEARCH_RESTAURANTS_SUCCESS,
  SEARCH_RESTAURANTS_FAILURE,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE,
  LOAD_RESTAURANT_REQUEST,
  LOAD_RESTAURANT_SUCCESS,
  LOAD_RESTAURANT_FAILURE,
} from './actions'

import Cart from '../../Cart'
import _ from 'lodash'
import moment from 'moment'

const initialState = {
  cart: new Cart(),
  address: null,
  date: null,
  restaurants: [],
  menu: null,
  isFetching: false,
}

export default (state = initialState, action = {}) => {
  let newCart, item

  switch (action.type) {

    case SEARCH_RESTAURANTS_REQUEST:
    case CHECKOUT_REQUEST:
      return {
        ...state,
        isFetching: true,
      }

    case SEARCH_RESTAURANTS_FAILURE:
    case CHECKOUT_FAILURE:
    case INIT_FAILURE:
      return {
        ...state,
        isFetching: false,
      }

    case INIT_REQUEST:

      // Add 30 minutes to make sure there is time
      let date = moment(_.first(action.payload.availabilities))
      date.add(30, 'minutes')

      return {
        ...state,
        isFetching: true,
        cart: new Cart(action.payload),
        menu: null, // For better navigation through restaurants
        date: date.format(),
      }

    case INIT_SUCCESS:

      return {
        ...state,
        isFetching: false,
        menu: action.payload.hasMenu
      }

    case CLEAR:
      return {
        ...state,
        cart: new Cart(),
        address: null,
        date: null
      }

    case ADD_ITEM:

      newCart = state.cart.clone()
      newCart.addMenuItem(
        action.payload.item,
        action.payload.options
      )

      return {
        ...state,
        cart: newCart
      }

    case REMOVE_ITEM:

      newCart = state.cart.clone()
      newCart.deleteItem(action.payload)

      return {
        ...state,
        cart: newCart
      }

    case INCREMENT_ITEM:

      newCart = state.cart.clone()

      item = _.find(newCart.items, item => item.menuItem.identifier === action.payload.menuItem.identifier)
      if (item) {
        item.increment()

        return {
          ...state,
          cart: newCart
        }
      }

    case DECREMENT_ITEM:

      newCart = state.cart.clone()

      item = _.find(newCart.items, item => item.menuItem.identifier === action.payload.menuItem.identifier)
      if (item) {
        item.decrement()

        return {
          ...state,
          cart: newCart
        }
      }

    case SET_ADDRESS:
      return {
        ...state,
        address: action.payload
      }

    case SEARCH_RESTAURANTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        restaurants: action.payload
      }

    case CHECKOUT_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }

    default:
      return { ...state }
  }
}
