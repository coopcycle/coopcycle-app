import {
  LOAD_ORDERS_SUCCESS,
  LOAD_ORDER_SUCCESS,
  LOAD_ADDRESSES_SUCCESS,
  LOAD_PERSONAL_INFO_SUCCESS,
} from './actions'

import {
  LOGOUT_SUCCESS,
} from '../App/actions'

const initialState = {
  orders: [],
  addresses: [],
  email: '',
  username: '',
  order: null,
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case LOAD_ORDERS_SUCCESS:

      return {
        ...state,
        orders: action.payload,
      }
    case LOAD_ORDER_SUCCESS:

        return {
          ...state,
          order: action.payload,
        }
    case LOAD_ADDRESSES_SUCCESS:

      return {
        ...state,
        addresses: action.payload,
      }
    case LOAD_PERSONAL_INFO_SUCCESS:

      return {
        ...state,
        email: action.payload.email,
        username: action.payload.username,
      }

    case LOGOUT_SUCCESS:

      return {
        ...state,
        ...initialState,
      }
  }

  return state
}
