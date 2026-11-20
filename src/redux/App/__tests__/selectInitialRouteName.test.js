import { selectInitialRouteName } from '../selectors';

const stateFor = (roles, { restaurants = [] } = {}) => ({
  app: {
    user: {
      username: 'bob',
      email: 'bob@example.org',
      token: 'a-token',
      roles,
      enabled: true,
      guest: false,
    },
  },
  restaurant: { myRestaurants: restaurants },
});

describe('selectInitialRouteName', () => {
  // The reason this ordering is explicit: an account holding both is a
  // dispatcher who is occasionally given a round, and they open the app to
  // run the board. Courier used to be checked first, so they landed on their
  // own task list instead.
  it('sends a dispatcher who is also a courier to the board', () => {
    expect(
      selectInitialRouteName(
        stateFor(['ROLE_USER', 'ROLE_COURIER', 'ROLE_DISPATCHER']),
      ),
    ).toBe('DispatchNav');
  });

  it('sends an admin who is also a courier to the board', () => {
    expect(
      selectInitialRouteName(
        stateFor(['ROLE_USER', 'ROLE_COURIER', 'ROLE_ADMIN']),
      ),
    ).toBe('DispatchNav');
  });

  it('still sends a courier-only account to its tasks', () => {
    expect(selectInitialRouteName(stateFor(['ROLE_USER', 'ROLE_COURIER']))).toBe(
      'CourierNav',
    );
  });

  it('sends a dispatcher who is not a courier to the board', () => {
    expect(
      selectInitialRouteName(stateFor(['ROLE_USER', 'ROLE_DISPATCHER'])),
    ).toBe('DispatchNav');
  });

  it('sends a store account to its store, and a restaurant one to its restaurants', () => {
    expect(selectInitialRouteName(stateFor(['ROLE_STORE']))).toBe('StoreNav');
    expect(
      selectInitialRouteName(
        stateFor(['ROLE_RESTAURANT'], { restaurants: [{ id: 1 }] }),
      ),
    ).toBe('RestaurantNav');
  });

  // An admin who also owns a restaurant now gets the board rather than the
  // restaurant, which is the same trade as the courier case above.
  it('prefers the board for an admin who also has a restaurant', () => {
    expect(
      selectInitialRouteName(
        stateFor(['ROLE_ADMIN', 'ROLE_RESTAURANT'], { restaurants: [{ id: 1 }] }),
      ),
    ).toBe('DispatchNav');
  });

  it('falls back to checkout with no user', () => {
    expect(
      selectInitialRouteName({ app: { user: null }, restaurant: { myRestaurants: [] } }),
    ).toBe('CheckoutNav');
  });
});
