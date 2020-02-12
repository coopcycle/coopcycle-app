import moment from 'moment'
import { getNextShippingTimeAsText } from '../checkout'

describe('getNextShippingTimeAsText', () => {

  it('returns expected results', () => {

    const restaurant = {
      availabilities: [
        '2020-02-12T19:00:00+01:00'
      ]
    }

    expect(
      getNextShippingTimeAsText(restaurant, moment.parseZone('2020-02-12T17:00:00+01:00'))
    ).toEqual('Today at 7:00 PM')

    expect(
      getNextShippingTimeAsText(restaurant, moment.parseZone('2020-02-12T18:40:00+01:00'))
    ).toEqual('20 - 25 minutes')

  })
})

