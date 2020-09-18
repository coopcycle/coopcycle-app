import moment from 'moment'
import { getNextShippingTimeAsText } from '../checkout'

const createTiming = (type, range, fast) => ({
  [type]: { range, fast },
})

describe('getNextShippingTimeAsText', () => {

  it('returns expected results', () => {

    const delivery = [
      '2020-02-12T18:55:00+01:00',
      '2020-02-12T19:05:00+01:00',
    ]

    const collection = [
      '2020-02-12T19:55:00+01:00',
      '2020-02-12T20:05:00+01:00',
    ]

    expect(
      getNextShippingTimeAsText({ timing: createTiming('delivery', delivery, false) }, moment.parseZone('2020-02-12T17:00:00+01:00'))
    ).toEqual('Today at 6:55 PM')

    expect(
      getNextShippingTimeAsText({ timing: createTiming('delivery', delivery, true) }, moment.parseZone('2020-02-12T18:40:00+01:00'))
    ).toEqual('15 - 20 minutes')

    expect(
      getNextShippingTimeAsText({ timing: createTiming('collection', collection, false) }, moment.parseZone('2020-02-12T17:00:00+01:00'))
    ).toEqual('Today at 7:55 PM')

    expect(
      getNextShippingTimeAsText({ timing: createTiming('collection', collection, true) }, moment.parseZone('2020-02-12T19:40:00+01:00'))
    ).toEqual('15 - 20 minutes')

    const timingWithBoth = {
      ...createTiming('delivery', delivery, false),
      ...createTiming('collection', collection, false),
    }

    expect(
      getNextShippingTimeAsText({ timing: timingWithBoth }, moment.parseZone('2020-02-12T17:00:00+01:00'))
    ).toEqual('Today at 6:55 PM')

  })
})

