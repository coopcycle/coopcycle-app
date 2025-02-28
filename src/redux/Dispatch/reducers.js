import { SET_STORE } from '../Delivery/actions';
import {
  DISPATCH_INITIALIZE,
  LOAD_USERS_SUCCESS,
  setUnassignedTasks,
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
    
      case setUnassignedTasks.type:
        return {
          ...state,
          store: action.payload
        }
  }

  return state;
};
