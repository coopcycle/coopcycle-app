import {
  DISPATCH_INITIALIZE,
  LOAD_USERS_SUCCESS,
} from './actions'

const initialState = {
  users: [],
  initialized: false,
}

export default (state = initialState, action = {}) => {

  switch (action.type) {

    case DISPATCH_INITIALIZE:
      return {
        ...state,
        initialized: true,
      }

    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
      }
  }

  return state
}
