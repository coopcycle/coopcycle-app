import { initCartFailure, updateCartSuccess } from '../actions';
import reducer from '../reducers';

// As we may be using setTimeout(), we need to mock timers
// @see https://jestjs.io/docs/en/timer-mocks.html
jest.useFakeTimers();

describe('Redux | Checkout | Reducers', () => {
  const initialState = reducer();

  describe('reducers', () => {
    test(`initCartFailure`, () => {
      const action = initCartFailure({
        restaurant: '/api/restaurants/10',
        error: new Error('Something went wrong'),
      });

      const prevState = {
        ...initialState,
        loadingCarts: ['/api/restaurants/10', '/api/restaurants/11'],
      };

      const newState = reducer(prevState, action);

      expect(newState).toEqual({
        ...initialState,
        loadingCarts: ['/api/restaurants/11'],
      });
    });

    test(`updateCartSuccess`, () => {
      const action = updateCartSuccess({
        restaurant: '/api/restaurants/10',
        // ...
      });

      const prevState = {
        ...initialState,
        loadingCarts: ['/api/restaurants/10', '/api/restaurants/11'],
      };

      const newState = reducer(prevState, action);

      expect(newState).toEqual({
        ...initialState,
        loadingCarts: ['/api/restaurants/11'],
        carts: {
          '/api/restaurants/10': {
            cart: {
              restaurant: '/api/restaurants/10',
              // ...
            },
          },
        },
      });
    });
  });
});
