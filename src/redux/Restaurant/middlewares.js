import _ from 'lodash';
import { AppState } from 'react-native';

import { pushNotification } from '../App/actions';
import { selectUser } from '../App/selectors';
import { LOAD_ORDERS_SUCCESS } from './actions';

export const ringOnNewOrderCreated = ({ getState, dispatch }) => {
  return next => action => {
    if (AppState.currentState !== 'active') {
      return next(action);
    }

    // Avoid ringing on first load
    if (action.type === LOAD_ORDERS_SUCCESS) {
      return next(action);
    }

    const prevState = getState();
    const result = next(action);
    const state = getState();

    const user = selectUser(state);
    const shouldShowAlert =
      user &&
      user.isAuthenticated() &&
      (user.hasRole('ROLE_ADMIN') || user.hasRole('ROLE_RESTAURANT'));

    if (!shouldShowAlert) {
      return result;
    }

    if (state.restaurant.orders.length > 0) {
      if (
        state.restaurant.orders.length !== prevState.restaurant.orders.length
      ) {
        const orders = _.differenceWith(
          state.restaurant.orders,
          prevState.restaurant.orders,
          (a, b) => a['@id'] + ':' + a.state === b['@id'] + ':' + b.state,
        );
        orders.forEach(o => {
          if (o.state === 'new') {
            dispatch(pushNotification('order:created', { order: o }));
          }
        });
      }
    }

    return result;
  };
};
