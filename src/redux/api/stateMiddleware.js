import { clearApiState } from './slice';
import { LOGOUT_SUCCESS, SET_BASE_URL } from '../App/actions';

export const ApiStateMiddleware = store => next => action => {
  if (action.type === LOGOUT_SUCCESS || action.type === SET_BASE_URL) {
    store.dispatch(clearApiState());
  }

  return next(action);
};
