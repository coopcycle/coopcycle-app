import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import AppUser from '../../../AppUser';
import appReducer from '../../App/reducers';
import { message as wsMessage } from '../../middlewares/CentrifugoMiddleware/actions';
import { loadOrderSuccess, loadOrdersSuccess } from '../actions';
import { ringOnNewOrderCreated } from '../middlewares';
import restaurantReducer from '../reducers';

describe('ringOnNewOrderCreated', () => {
  beforeEach(() => {
    jest.mock('react-native/Libraries/AppState/AppState', () => ({
      currentState: 'active',
    }));
  });

  it('does nothing with action type "LOAD_ORDERS_SUCCESS"', () => {
    const preloadedState = {
      app: {
        notifications: [],
      },
      restaurant: {
        orders: [],
      },
    };

    const reducer = combineReducers({
      app: appReducer,
      restaurant: restaurantReducer,
    });

    const store = createStore(
      reducer,
      preloadedState,
      applyMiddleware(ringOnNewOrderCreated),
    );

    store.dispatch(
      loadOrdersSuccess([{ '@id': '/api/orders/1', state: 'new' }]),
    );

    const newState = store.getState();

    expect(newState).toMatchObject({
      app: {
        notifications: [],
      },
      restaurant: {
        orders: [{ '@id': '/api/orders/1', state: 'new' }],
      },
    });
  });

  it('pushes new notification with action type "LOAD_ORDER_SUCCESS"', () => {
    const preloadedState = {
      app: {
        notifications: [],
        user: new AppUser(
          'bob',
          'bob@example.com',
          'abc123456',
          ['ROLE_RESTAURANT'],
          '',
        ),
      },
      restaurant: {
        orders: [],
      },
    };

    const reducer = combineReducers({
      app: appReducer,
      restaurant: restaurantReducer,
    });

    const store = createStore(
      reducer,
      preloadedState,
      applyMiddleware(ringOnNewOrderCreated),
    );

    store.dispatch(loadOrderSuccess({ '@id': '/api/orders/1', state: 'new' }));

    const newState = store.getState();

    expect(newState).toMatchObject({
      app: {
        notifications: [
          {
            event: 'order:created',
            params: {
              order: { '@id': '/api/orders/1', state: 'new' },
            },
          },
        ],
      },
      restaurant: {
        orders: [{ '@id': '/api/orders/1', state: 'new' }],
      },
    });
  });

  it('pushes new notification with action type "MESSAGE"', () => {
    const preloadedState = {
      app: {
        notifications: [],
        user: new AppUser(
          'bob',
          'bob@example.com',
          'abc123456',
          ['ROLE_RESTAURANT'],
          '',
        ),
      },
      restaurant: {
        orders: [],
      },
    };

    const reducer = combineReducers({
      app: appReducer,
      restaurant: restaurantReducer,
    });

    const store = createStore(
      reducer,
      preloadedState,
      applyMiddleware(thunk, ringOnNewOrderCreated),
    );

    store.dispatch(
      wsMessage({
        name: 'order:created',
        data: { order: { '@id': '/api/orders/1', state: 'new' } },
      }),
    );

    const newState = store.getState();

    expect(newState).toMatchObject({
      app: {
        notifications: [
          {
            event: 'order:created',
            params: {
              order: { '@id': '/api/orders/1', state: 'new' },
            },
          },
        ],
      },
      restaurant: {
        orders: [{ '@id': '/api/orders/1', state: 'new' }],
      },
    });
  });

  it('does nothing when order is already loaded', () => {
    const preloadedState = {
      app: {
        notifications: [],
      },
      restaurant: {
        orders: [{ '@id': '/api/orders/1', state: 'new' }],
      },
    };

    const reducer = combineReducers({
      app: appReducer,
      restaurant: restaurantReducer,
    });

    const store = createStore(
      reducer,
      preloadedState,
      applyMiddleware(ringOnNewOrderCreated),
    );

    store.dispatch(loadOrderSuccess({ '@id': '/api/orders/1', state: 'new' }));

    const newState = store.getState();

    expect(newState).toMatchObject({
      app: {
        notifications: [],
      },
      restaurant: {
        orders: [{ '@id': '/api/orders/1', state: 'new' }],
      },
    });
  });
});
