import moment from 'moment'
import { Buffer } from 'buffer'
import { encodeForPrinter } from '../order'

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
    }

    const expected =
`@\u001btI--------------------------------
\u001baORDER AAA (#1)
--------------------------------
\u001ba\u0001PICKUP EXPECTED AT ${time.format('LT')}
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
