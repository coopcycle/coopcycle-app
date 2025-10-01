import { actionMatchCreator } from '../util';
import { initialized, loadUsersSuccess } from './actions';

function initializedReducer(state = false, action = {}) {
  if (actionMatchCreator(action, [initialized])) {
    return true;
  }

  return state;
}

function usersReducer(state = [], action = {}) {
  if (actionMatchCreator(action, [loadUsersSuccess])) {
    return action.payload;
  }
  return state;
}

export default {
  initialized: initializedReducer,
  users: usersReducer,
};
