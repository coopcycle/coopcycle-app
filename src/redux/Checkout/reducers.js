import {
  ADD_ITEM_REQUEST,
  ADD_ITEM_REQUEST_FINISHED,
  CHECKOUT_FAILURE,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
  CLEAR,
  CLEAR_SEARCH_RESULTS,
  DELETE_CART_REQUEST,
  GET_RESTAURANT_FAILURE,
  GET_RESTAURANT_REQUEST,
  GET_RESTAURANT_SUCCESS,
  HIDE_ADDRESS_MODAL,
  HIDE_EXPIRED_SESSION_MODAL,
  HIDE_MULTIPLE_SERVERS_IN_SAME_CITY_MODAL,
  INIT_CART_REQUEST,
  INIT_CART_SUCCESS,
  INIT_FAILURE,
  INIT_REQUEST,
  INIT_SUCCESS,
  LOAD_PAYMENT_DETAILS_FAILURE,
  LOAD_PAYMENT_DETAILS_REQUEST,
  LOAD_PAYMENT_DETAILS_SUCCESS,
  LOAD_PAYMENT_METHODS_FAILURE,
  LOAD_PAYMENT_METHODS_REQUEST,
  LOAD_PAYMENT_METHODS_SUCCESS,
  LOAD_RESTAURANTS_FAILURE,
  LOAD_RESTAURANTS_REQUEST,
  LOAD_RESTAURANTS_SUCCESS,
  LOAD_STRIPE_SAVED_PAYMENT_METHODS_FAILURE,
  LOAD_STRIPE_SAVED_PAYMENT_METHODS_REQUEST,
  LOAD_STRIPE_SAVED_PAYMENT_METHODS_SUCCESS,
  REMOVE_ITEM,
  RESET_RESTAURANT,
  SEARCH_FAILURE,
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SESSION_EXPIRED,
  SET_ADDRESS,
  SET_ADDRESS_MODAL_HIDDEN,
  SET_ADDRESS_MODAL_MESSAGE,
  SET_ADDRESS_OK,
  SET_CART_VALIDATION,
  SET_CHECKOUT_LOADING,
  SET_RESTAURANT,
  SET_TIMING,
  SET_TOKEN,
  SHOW_ADDRESS_MODAL,
  SHOW_EXPIRED_SESSION_MODAL,
  SHOW_TIMING_MODAL,
  UPDATE_CARTS,
  UPDATE_CART_SUCCESS,
  UPDATE_CUSTOMER_GUEST,
  UPDATE_ITEM_QUANTITY,
  STOP_ASKING_TO_ENABLE_REUSABLE_PACKAGING,
  INIT_CART_FAILURE,
  CLEAR_ADDRESS,
} from './actions'

import i18n from '../../i18n'
import _ from 'lodash'

const initialState = {
  loadingCarts: [],
  carts: {},
  address: null,
  isAddressOK: null,
  addressModalMessage: '',
  date: null,
  restaurants: [],
  restaurant: null,
  menu: null,
  isFetching: false,
  errors: [],
  isAddressModalVisible: false,
  // This is used to make sure address modal is hidden,
  // before showing expired session modal
  // @see https://github.com/react-native-community/react-native-modal#i-cant-show-multiple-modals-one-after-another
  isAddressModalHidden: true,
  timing: {},
  isValid: null,
  violations: [],
  isLoading: false,
  itemRequestStack: [],
  token: null,
  isExpiredSessionModalVisible: false,
  isSessionExpired: false,
  paymentMethods: [],
  paymentDetails: {},
  paymentDetailsLoaded: false,
  guest: null,
  timingModal: {
    displayed: false,
    message: null,
  },
  showMultipleServersInSameCityModal: true,
  searchResultsLoaded: false,
  searchResults: null,
  stripePaymentMethodsLoaded: false,
  stripePaymentMethods: [],
  shouldAskToEnableReusablePackaging: true,
}

export default (state = initialState, action = {}) => {

  switch (action.type) {

    case LOAD_RESTAURANTS_REQUEST:
    case CHECKOUT_REQUEST:
    case LOAD_PAYMENT_METHODS_REQUEST:
      return {
        ...state,
        isFetching: true,
      }

    case LOAD_PAYMENT_DETAILS_REQUEST:
      return {
        ...state,
        paymentDetailsLoaded: false,
        isFetching: true,
      }

    case LOAD_RESTAURANTS_FAILURE:
    case INIT_FAILURE:
    case LOAD_PAYMENT_METHODS_FAILURE:
    case LOAD_PAYMENT_DETAILS_FAILURE:
    case SEARCH_FAILURE:
    case GET_RESTAURANT_FAILURE:
    case LOAD_STRIPE_SAVED_PAYMENT_METHODS_FAILURE:
      return {
        ...state,
        isFetching: false,
      }

    case CHECKOUT_FAILURE:

      let errors = [i18n.t('TRY_LATER')]

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

      return {
        ...state,
        isFetching: true,
        isSessionExpired: false,
        restaurant: action.payload.restaurant,
        cart: null,
        menu: null, // For better navigation through restaurants
      }

    case RESET_RESTAURANT:

      return {
        ...state,
        restaurant: action.payload.restaurant,
        cart: null,
        menu: null, // For better navigation through restaurants
        timingModal: initialState.timingModal, // Be sure to reset the timingModal
      }

    case INIT_SUCCESS:

      return {
        ...state,
        cart: state.carts[action.payload.restaurant['@id']].cart,
        token: state.carts[action.payload.restaurant['@id']].token,
        isFetching: false,
        restaurant: action.payload.restaurant,
        isAddressOK: null, // We don't know if it's valid
        itemRequestStack: [],
      }

    case SET_RESTAURANT:
      return {
        ...state,
        restaurant: action.payload,
        timingModal: initialState.timingModal, // Be sure to reset the timingModal
        isValid: null,
        violations: [],
      }

    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      }

    case INIT_CART_REQUEST:
      return {
        ...state,
        loadingCarts: [ ...state.loadingCarts, action.payload ],
        carts: {
          ...state.carts,
        },
      }

    case INIT_CART_SUCCESS:
      return {
        ...state,
        carts: {
          ...state.carts,
          [action.payload.cart.restaurant]: action.payload,
        },
      }

    case INIT_CART_FAILURE:
      return {
        ...state,
        loadingCarts: _.without(state.loadingCarts, action.payload.restaurant),
      }

    case CLEAR:
      return {
        ...state,
        cart: null,
        date: null,
        itemRequestStack: [],
      }

    case REMOVE_ITEM:
      return {
        ...state,
        carts: {
          ...state.carts,
          [action.payload.vendor['@id']]: {
            ...state.carts[action.payload.vendor['@id']],
            cart: {
              ...state.carts[action.payload.vendor['@id']].cart,
              items: _.filter(state.carts[action.payload.vendor['@id']].cart.items, item => item.id !== action.payload.id),
            },
          },
        },
      }

    case UPDATE_ITEM_QUANTITY:
      return {
        ...state,
        carts: {
          ...state.carts,
          [action.payload.item.vendor['@id']]: {
            ...state.carts[action.payload.item.vendor['@id']],
            cart: {
              ...state.carts[action.payload.item.vendor['@id']].cart,
              items: _.map(state.carts[action.payload.item.vendor['@id']].cart.items, item => {
                if (item.id === action.payload.item.id) {

                  return {
                    ...item,
                    quantity: action.payload.quantity,
                  }
                }

                return item
              }),
            },
          },
        },
      }

    case SET_ADDRESS:
      return {
        ...state,
        address: action.payload,
      }

    case SET_ADDRESS_OK:
      return {
        ...state,
        isAddressOK: action.payload,
      }

    case LOAD_RESTAURANTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        restaurants: action.payload,
      }

    case CHECKOUT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errors: [],
      }

    case SHOW_ADDRESS_MODAL:
      return {
        ...state,
        isAddressModalVisible: true,
        addressModalMessage: action.payload || state.addressModalMessage,
      }

    case HIDE_ADDRESS_MODAL:
      return {
        ...state,
        isAddressModalVisible: false,
        addressModalMessage: initialState.addressModalMessage,
      }

    case SET_ADDRESS_MODAL_MESSAGE:
      return {
        ...state,
        addressModalMessage: action.payload,
      }

    case SET_TIMING:
      return {
        ...state,
        timing: action.payload,
      }

    case SET_CART_VALIDATION:
      return {
        ...state,
        isValid: action.payload.isValid,
        violations: action.payload.violations,
      }

    case UPDATE_CART_SUCCESS:
      return {
        ...state,
        loadingCarts: _.without(state.loadingCarts, action.payload.restaurant),
        carts: {
          ...state.carts,
          [action.payload.restaurant]:
            {
              ...state.carts[action.payload.restaurant],
              cart: action.payload,
            },
        },
        //cart: action.payload,
        isFetching: false,
      }

    case UPDATE_CARTS:
      return {
        ...state,
        carts: action.payload,
      }

    case DELETE_CART_REQUEST:
      return {
        ...state,
        carts: {
          ...state.carts,
          [action.payload]:
            {
              ...state.carts[action.payload],
              softDelete: true,
            },
        },
      }

    case SET_CHECKOUT_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }

    case ADD_ITEM_REQUEST:
      return {
        ...state,
        itemRequestStack: state.itemRequestStack.concat(action.payload.identifier),
        addressModalMessage: initialState.addressModalMessage,
      }

    case ADD_ITEM_REQUEST_FINISHED:

      const itemRequestIndex = _.findLastIndex(state.itemRequestStack, identifier => identifier === action.payload.identifier)
      if (itemRequestIndex === -1) {
        return state
      }

      const newItemRequestStack = state.itemRequestStack.slice()
      newItemRequestStack.splice(itemRequestIndex, 1)

      return {
        ...state,
        itemRequestStack: newItemRequestStack,
      }

    case SHOW_EXPIRED_SESSION_MODAL:

      return {
        ...state,
        isExpiredSessionModalVisible: true,
      }

    case HIDE_EXPIRED_SESSION_MODAL:

      return {
        ...state,
        isExpiredSessionModalVisible: false,
      }

    case SESSION_EXPIRED:

      return {
        ...state,
        isSessionExpired: true,
        isExpiredSessionModalVisible: true,
      }

    case SET_ADDRESS_MODAL_HIDDEN:

      return {
        ...state,
        isAddressModalHidden: action.payload,
      }

    case LOAD_PAYMENT_METHODS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        paymentMethods: action.payload.methods,
      }

    case LOAD_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        paymentDetailsLoaded: true,
        paymentDetails: action.payload,
      }

    case UPDATE_CUSTOMER_GUEST:
        return {
          ...state,
          guest: action.payload,
        }

    case SHOW_TIMING_MODAL:
      if (typeof action.payload === 'boolean') {
        return {
          ...state,
          timingModal: {
            displayed: action.payload,
          },
        }
      }
      if (typeof action.payload === 'object') {
        return {
          ...state,
          timingModal: {
            ...initialState.timingModal,
            ...action.payload,
          },
        }
      }
        break

    case HIDE_MULTIPLE_SERVERS_IN_SAME_CITY_MODAL:

      return {
        ...state,
        showMultipleServersInSameCityModal: false,
      }

    case SEARCH_REQUEST:
      return {
        ...state,
        searchResultsLoaded: false,
        isFetching: true,
      }

    case SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        searchResultsLoaded: true,
        searchResults: action.payload,
      }

    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: null,
      }

    case GET_RESTAURANT_REQUEST:
      return {
        ...state,
        isFetching: true,
      }

    case GET_RESTAURANT_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }

    case LOAD_STRIPE_SAVED_PAYMENT_METHODS_REQUEST:
      return {
        ...state,
        stripePaymentMethodsLoaded: false,
        isFetching: true,
      }

    case LOAD_STRIPE_SAVED_PAYMENT_METHODS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        stripePaymentMethodsLoaded: true,
        stripePaymentMethods: action.payload.methods,
      }
    case STOP_ASKING_TO_ENABLE_REUSABLE_PACKAGING:
      return {
        ...state,
        shouldAskToEnableReusablePackaging: false,
      }
    case CLEAR_ADDRESS:
      return {
        ...state,
        address: null,
      }
  }

  return state
}
