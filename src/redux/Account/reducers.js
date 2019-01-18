import {
  LOAD_ORDERS_REQUEST,
  LOAD_ORDERS_SUCCESS,
  LOAD_ORDERS_FAILURE,
} from './actions'

const initialState = {
  isFetching: false,
  initialized: false,
  orders: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case LOAD_ORDERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case LOAD_ORDERS_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    case LOAD_ORDERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        initialized: true,
        orders: action.payload,
      }
  }

  return state
}
