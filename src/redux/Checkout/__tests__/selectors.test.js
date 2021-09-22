import moment from 'moment'

import {
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
        cart: {
          shippingTimeRange: null,
        },
      },
    })).toEqual('Loading')

    expect(selectShippingTimeRangeLabel({
      checkout: {
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
      },
    })).toEqual('Delivery in 35 - 45 minutes')

    expect(selectShippingTimeRangeLabel({
      checkout: {
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
      },
    })).toEqual('Delivery friday at 12:20 pm')

    expect(selectShippingTimeRangeLabel({
      checkout: {
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
      },
    })).toEqual('Delivery today at 1:30 pm')

    expect(selectShippingTimeRangeLabel({
      checkout: {
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
      },
    })).toEqual('Delivery today at 2:30 pm')

  })

})
