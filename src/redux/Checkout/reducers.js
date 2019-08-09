import {
  INIT_REQUEST,
  INIT_SUCCESS,
  INIT_FAILURE,
  ADD_ITEM,
  REMOVE_ITEM,
  INCREMENT_ITEM,
  DECREMENT_ITEM,
  SET_ADDRESS,
  SET_ADDRESS_OK,
  SET_DATE,
  CLEAR,
  LOAD_RESTAURANTS_REQUEST,
  LOAD_RESTAURANTS_SUCCESS,
  LOAD_RESTAURANTS_FAILURE,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE,
  LOAD_RESTAURANT_REQUEST,
  LOAD_RESTAURANT_SUCCESS,
  LOAD_RESTAURANT_FAILURE,
  SHOW_ADDRESS_MODAL,
  HIDE_ADDRESS_MODAL
} from './actions'

import Cart from '../../Cart'
import i18n from '../../i18n'
import _ from 'lodash'
import moment from 'moment'

const initialState = {
  cart: new Cart(),
  address: null,
  isAddressOK: null,
  date: null,
  restaurants: [],
  menu: null,
  isFetching: false,
  errors: [],
  isAddressModalVisible: false
}

export default (state = initialState, action = {}) => {
  let newCart, item

  switch (action.type) {

    case LOAD_RESTAURANTS_REQUEST:
    case CHECKOUT_REQUEST:
      return {
        ...state,
        isFetching: true,
      }

    case LOAD_RESTAURANTS_FAILURE:
    case INIT_FAILURE:
      return {
        ...state,
        isFetching: false,
      }

    case CHECKOUT_FAILURE:

      let errors = [ i18n.t('TRY_LATER') ]

      if (action.payload.hasOwnProperty('@context')
        && action.payload.hasOwnProperty('@type')
        && action.payload.hasOwnProperty('violations')
        && Array.isArray(action.payload.violations)) {
        errors = action.payload.violations.map(violation => violation.message)
      }

      return {
        ...state,
        errors,
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
        menu: action.payload.hasMenu,
        isAddressOK: null // We don't know if it's valid
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

      item = _.find(state.cart.items, item => item.menuItem.identifier === action.payload.menuItem.identifier)
      if (item) {
        item.decrement()

        if (item.quantity === 0) {
          state.cart.deleteItem(item)
        }

        return {
          ...state,
          cart: state.cart.clone()
        }
      }

    case SET_ADDRESS:
      return {
        ...state,
        address: action.payload
      }

    case SET_ADDRESS_OK:
      return {
        ...state,
        isAddressOK: action.payload
      }

    case SET_DATE:
      return {
        ...state,
        date: action.payload
      }

    case LOAD_RESTAURANTS_SUCCESS:
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

    case SHOW_ADDRESS_MODAL:
      return {
        ...state,
        isAddressModalVisible: true,
      }

    case HIDE_ADDRESS_MODAL:
      return {
        ...state,
        isAddressModalVisible: false,
      }

    default:
      return { ...state }
  }
}
