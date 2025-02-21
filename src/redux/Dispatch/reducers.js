import {
  DISPATCH_INITIALIZE,
  LOAD_USERS_SUCCESS,
} from './actions';

const initialState = {
  initialized: false,
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
  }

  return state;
};
