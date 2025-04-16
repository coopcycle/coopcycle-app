import { actionMatchCreator } from '../util';
import {
  initialized,
  loadUsersSuccess,
} from './actions';

const initialState = {
  initialized: false,
  users: [],
};

export default (state = initialState, action = {}) => {
  if (actionMatchCreator(action, [
    initialized,
  ])) {
    return {
      ...state,
      initialized: true,
    };
  }

  if (actionMatchCreator(action, [
    loadUsersSuccess,
  ])) {
    return {
      ...state,
      users: action.payload,
    };
  }

  return state;
};
