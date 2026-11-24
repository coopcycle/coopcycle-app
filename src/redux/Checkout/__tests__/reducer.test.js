import {
  hideExpiredSessionModal,
  initCartFailure,
  setRestaurant,
  updateCartSuccess,
} from '../actions';
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

    test(`setRestaurant keeps the shop whole, and its IRI`, () => {
      const restaurant = { '@id': '/api/restaurants/10', name: 'Nodaiwa' };

      const newState = reducer(initialState, setRestaurant(restaurant));

      expect(newState.restaurant).toEqual('/api/restaurants/10');
      expect(newState.selectedRestaurant).toEqual(restaurant);
    });

    test(`setRestaurant still accepts a bare IRI`, () => {
      const newState = reducer(
        initialState,
        setRestaurant('/api/restaurants/10'),
      );

      expect(newState.restaurant).toEqual('/api/restaurants/10');
      expect(newState.selectedRestaurant).toEqual(null);
    });

    test(`hideExpiredSessionModal drops the expired cart`, () => {
      const prevState = {
        ...initialState,
        restaurant: '/api/restaurants/10',
        isExpiredSessionModalVisible: true,
        carts: {
          '/api/restaurants/10': { cart: {}, token: 'a' },
          '/api/restaurants/11': { cart: {}, token: 'b' },
        },
      };

      const newState = reducer(prevState, hideExpiredSessionModal());

      expect(newState.isExpiredSessionModalVisible).toBe(false);
      expect(Object.keys(newState.carts)).toEqual(['/api/restaurants/11']);
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
