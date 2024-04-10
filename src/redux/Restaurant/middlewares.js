import { AppState } from 'react-native';
import _ from 'lodash';

import { addNotification } from '../App/actions';
import { selectUser } from '../App/selectors';
import { EVENT as EVENT_ORDER } from '../../domain/Order';
import { MESSAGE as CENTRIFUGO_MESSAGE } from '../middlewares/CentrifugoMiddleware'

export const notifyOnNewOrderCreated = ({ getState, dispatch }) => {
  return next => action => {
    if (AppState.currentState !== 'active') {
      return next(action);
    }

    // Only create notification for updates received via Centrifugo
    if (action.type !== CENTRIFUGO_MESSAGE) {
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
            dispatch(addNotification(EVENT_ORDER.CREATED, { order: o }));
          }
        });
      }
    }

    return result;
  };
};
