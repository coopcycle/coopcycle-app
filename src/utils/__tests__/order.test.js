import moment from 'moment'
import { Buffer } from 'buffer'
import { encodeForPrinter, resolveFulfillmentMethod, matchesDate } from '../order'

describe('encodeForPrinter', () => {

  it('returns expected results', () => {

    const time = moment('2020-01-18 09:00:00')

    const order = {
      number: 'AAA',
      id: 1,
      preparationExpectedAt: time,
      pickupExpectedAt: time,
      items: [{
        name: 'Burger',
        total: 900,
        quantity: 2,
        adjustments: [],
      }, {
        name: 'Cake',
        total: 500,
        quantity: 1,
        adjustments: [],
      }],
      itemsTotal: 2300,
      customer: {
        email: 'camille@example.com',
      },
    }

    const expected =
      `@\u001btI--------------------------------
\u001ba\u001b!\u0010ORDER AAA (#1)
CUSTOMER: camille@example.com
--------------------------------
\u001ba\u0001PICKUP EXPECTED ON ${time.format('LL')}
\u001ba\u0001AT ${time.format('LT')}
--------------------------------

\u001ba2 x Burger               EUR9.00

\u001ba\u00001 x Cake                 EUR5.00

--------------------------------
\u001ba\u0000TOTAL                   EUR23.00
--------------------------------



`.split('\n')
    const res = encodeForPrinter(order)
    const text = Buffer.from(res).toString()

    const actual = text
      .replace(/\r/gm, '')
      .replace(/(\u0000)/, '')
      .replace(/(\u0001)/, '')
      .replace(/(\u001b)/, '')
      .split('\n')

    expect(actual).toHaveLength(expected.length)
    expect(actual).toEqual(expected)
  })
})

describe('encodeForPrinterToday', () => {

  it('returns expected results', () => {

    const time = moment()

    const order = {
      number: 'AAA',
      id: 1,
      preparationExpectedAt: time,
      pickupExpectedAt: time,
      items: [{
        name: 'Burger',
        total: 900,
        quantity: 2,
        adjustments: [],
      }, {
        name: 'Cake',
        total: 500,
        quantity: 1,
        adjustments: [],
      }],
      itemsTotal: 2300,
      customer: {
        email: 'camille@example.com',
      },
    }

    const expected =
    `@\u001btI--------------------------------
\u001ba\u001b!\u0010ORDER AAA (#1)
CUSTOMER: camille@example.com
--------------------------------
\u001ba\u0001PICKUP TODAY
\u001ba\u0001AT ${time.format('LT')}
--------------------------------

\u001ba2 x Burger               EUR9.00

\u001ba\u00001 x Cake                 EUR5.00

--------------------------------
\u001ba\u0000TOTAL                   EUR23.00
--------------------------------



`.split('\n')

    const res = encodeForPrinter(order)
    const text = Buffer.from(res).toString()

    const actual = text
      .replace(/\r/gm, '')
      .replace(/(\u0000)/, '')
      .replace(/(\u0001)/, '')
      .replace(/(\u0002)/, '')
      .replace(/(\u001b)/, '')
      .split('\n')

    expect(actual).toHaveLength(expected.length)
    expect(actual).toEqual(expected)
  })
})

describe('resolveFulfillmentMethod', () => {
  it('returns expected results', () => {
    expect(resolveFulfillmentMethod({})).toEqual('delivery')
    expect(resolveFulfillmentMethod({ takeaway: false })).toEqual('delivery')
    expect(resolveFulfillmentMethod({ takeaway: true })).toEqual('collection')
    expect(resolveFulfillmentMethod({ fulfillmentMethod: 'delivery' })).toEqual('delivery')
    expect(resolveFulfillmentMethod({ fulfillmentMethod: 'collection' })).toEqual('collection')
  })
})

describe('matchesDate', () => {
  it('returns expected results', () => {

    expect(
      matchesDate(
        { pickupExpectedAt: '2021-01-13T21:50:00+01:00' },
        moment('2021-01-12')
      )
    ).toBe(false)

    expect(
      matchesDate(
        { pickupExpectedAt: '2021-01-13T21:50:00+01:00' },
        moment('2021-01-13')
      )
    ).toBe(true)

    expect(
      matchesDate(
        { pickupExpectedAt: '2021-01-13T21:50:00+01:00' },
        '2021-01-13'
      )
    ).toBe(true)

    expect(
      matchesDate(
        { pickupExpectedAt: '2021-01-13T21:50:00+01:00' },
        moment('2021-01-14')
      )
    ).toBe(false)

  })

})
