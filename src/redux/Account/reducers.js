import {
  LOAD_ORDERS_SUCCESS,
  LOAD_ADDRESSES_SUCCESS,
} from './actions'

const initialState = {
  orders: [],
  addresses: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case LOAD_ORDERS_SUCCESS:

      return {
        ...state,
        orders: action.payload,
      }
    case LOAD_ADDRESSES_SUCCESS:

      return {
        ...state,
        addresses: action.payload,
      }
  }

  return state
}
