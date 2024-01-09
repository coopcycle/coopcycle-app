import moment from 'moment'

import {
  selectCheckoutAuthorizationHeaders,
  selectRestaurant,
  selectShippingTimeRangeLabel,
} from '../selectors'

describe('Redux | Checkout | Selectors', () => {

  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('selectShippingTimeRangeLabel', () => {

    jest.setSystemTime(moment('2021-01-26T12:00:00+01:00').toDate())

    expect(selectShippingTimeRangeLabel({
      checkout: {
        timing: {},
        restaurants: [],
        cart: {
          shippingTimeRange: null,
        },
        carts: {
          '/api/restaurants/1': {
            cart: { shippingTimeRange: null },
            restaurant: {
              '@id': '/api/restaurants/1',
            },
          },
        },
      },
    })).toEqual('Loading')

    expect(selectShippingTimeRangeLabel({
      checkout: {
        restaurants: [],
        restaurant: '/api/restaurants/1',
        timing: {
          today: true,
          fast: true,
          diff: '35 - 45',
          range: [
            '2021-01-29T12:20:00+01:00',
            '2021-01-29T12:30:00+01:00',
          ],
        },
        cart: {
          shippingTimeRange: null,
        },
        carts: {
          '/api/restaurants/1': {
            cart: { shippingTimeRange: null },
            restaurant: {
              '@id': '/api/restaurants/1',
            },
          }
        },
      },
    })).toEqual('Delivery in 35 - 45 minutes')

    expect(selectShippingTimeRangeLabel({
      checkout: {
        restaurants: [],
        restaurant: '/api/restaurants/1',
        timing: {
          today: false,
          fast: false,
          range: [
            '2021-01-29T12:20:00+01:00',
            '2021-01-29T12:30:00+01:00',
          ],
        },
        cart: {
          shippingTimeRange: null,
        },
        carts: {
          '/api/restaurants/1': {
            cart: { shippingTimeRange: null },
            restaurant: {
              '@id': '/api/restaurants/1',
            },
          }
        },
      },
    })).toEqual('Delivery friday at 12:20 pm')

    expect(selectShippingTimeRangeLabel({
      checkout: {
        restaurants: [],
        restaurant: '/api/restaurants/1',
        timing: {
          today: true,
          fast: false,
          range: [
            '2021-01-26T13:30:00+01:00',
            '2021-01-26T13:40:00+01:00',
          ],
        },
        cart: {
          shippingTimeRange: null,
        },
        carts: {
          '/api/restaurants/1': {
            cart: { shippingTimeRange: null },
            restaurant: {
              '@id': '/api/restaurants/1',
            },
          }
        },
      },
    })).toEqual('Delivery today at 1:30 pm')

    expect(selectShippingTimeRangeLabel({
      checkout: {
        restaurants: [],
        restaurant: '/api/restaurants/1',
        timing: {
          today: true,
          fast: false,
          range: [
            '2021-01-26T13:30:00+01:00',
            '2021-01-26T13:40:00+01:00',
          ],
        },
        cart: {
          shippingTimeRange: [
            '2021-01-26T14:30:00+01:00',
            '2021-01-26T14:40:00+01:00',
          ],
        },
        carts: {
          '/api/restaurants/1': {
            cart: {
              shippingTimeRange: [
                '2021-01-26T14:30:00+01:00',
                '2021-01-26T14:40:00+01:00',
              ],
            },
            restaurant: {
              '@id': '/api/restaurants/1',
            },
          }
        }
      },
    })).toEqual('Delivery today at 2:30 pm')

  })

  describe('selectRestaurant', () => {

    describe('restaurant selected', () => {
      describe('restaurant in list', () => {
        it('should return the restaurant', () => {
          expect(selectRestaurant({
            checkout: {
              restaurants: [{
                '@id': '/api/restaurants/1',
              }],
              restaurant: '/api/restaurants/1',
              carts: {},
            },
          })).toEqual({
            '@id': '/api/restaurants/1',
          })
        })
      })

      describe('restaurant in carts', () => {
        it('should return the restaurant', () => {
          expect(selectRestaurant({
            checkout: {
              restaurants: [],
              restaurant: '/api/restaurants/1',
              carts: {
                '/api/restaurants/1': {
                  cart: {
                  },
                  restaurant: {
                    '@id': '/api/restaurants/1',
                  },
                }
              }
            },
          })).toEqual({
            '@id': '/api/restaurants/1',
          })
        })
      })

      describe('restaurant in both list and carts', () => {
        it('should return the restaurant', () => {
          expect(selectRestaurant({
            checkout: {
              restaurants: [{
                '@id': '/api/restaurants/1',
              }],
              restaurant: '/api/restaurants/1',
              carts: {
                '/api/restaurants/1': {
                  cart: {
                  },
                  restaurant: {
                    '@id': '/api/restaurants/1',
                  },
                }
              }
            },
          })).toEqual({
            '@id': '/api/restaurants/1',
          })
        })
      })

      describe('restaurant is NOT in list or carts', () => {
        it('should return null', () => {
          expect(selectRestaurant({
            checkout: {
              restaurants: [],
              restaurant: '/api/restaurants/1',
              carts: {},
            },
          })).toEqual(null)
        })
      })
    })

    describe('restaurant not selected', () => {
      it('should return null', () => {
        expect(selectRestaurant({
          checkout: {
            restaurants: [],
            restaurant: null,
            carts: {},
          },
        })).toEqual(null)
      })
    })
  })

  describe('selectCheckoutAuthorizationHeaders', () => {
    describe('a user with an account', () => {
      const user = {
        isAuthenticated: () => true,
      }

      describe('cart is assigned to a user', () => {
        it('should use default token', () => {
          expect(
            selectCheckoutAuthorizationHeaders(
              {
                app: {
                  user: user,
                },
              },
              {
                customer: '/api/customers/1',
              },
              'session-token',
            ),
          ).toEqual({})
        })
      })

      describe('cart is NOT assigned to a user', () => {
        it('should use a session token', () => {
          expect(
            selectCheckoutAuthorizationHeaders(
              {
                app: {
                  user: user,
                },
              },
              {
                customer: null,
              },
              'session-token',
            ),
          ).toEqual({
            Authorization: 'Bearer session-token',
          })
        })
      })
    })

    describe('a user in a guest mode', () => {
      const user = {
        isAuthenticated: () => false,
        isGuest: () => true,
      }

      describe('cart is assigned to a user', () => {
        it('should use a session token', () => {
          expect(
            selectCheckoutAuthorizationHeaders(
              {
                app: {
                  user: user,
                },
              },
              {
                customer: '/api/customers/1',
              },
              'session-token',
            ),
          ).toEqual({
            Authorization: 'Bearer session-token',
          })
        })
      })

      describe('cart is NOT assigned to a user', () => {
        it('should use a session token', () => {
          expect(
            selectCheckoutAuthorizationHeaders(
              {
                app: {
                  user: user,
                },
              },
              {
                customer: null,
              },
              'session-token',
            ),
          ).toEqual({
            Authorization: 'Bearer session-token',
          })
        })
      })
    })

    describe('unauthenticated user (!= guest mode)', () => {
      const user = {
        isAuthenticated: () => false,
        isGuest: () => false,
      }

      it('should use a session token', () => {
        expect(
          selectCheckoutAuthorizationHeaders(
            {
              app: {
                user: user,
              },
            },
            {
              customer: null,
            },
            'session-token',
          ),
        ).toEqual({
          Authorization: 'Bearer session-token',
        })
      })
    })
  })
})
