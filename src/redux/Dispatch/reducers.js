import {
  DISPATCH_INITIALIZE,
  LOAD_STORES_SUCCESS,
  LOAD_USERS_SUCCESS,
} from './actions';

const initialState = {
  initialized: false,
  stores: [],
  users: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case DISPATCH_INITIALIZE:
      return {
        ...state,
        initialized: true,
      };

    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
      };

    case LOAD_STORES_SUCCESS:
      return {
        ...state,
        stores: action.payload,
      }
  }

  return state;
};
