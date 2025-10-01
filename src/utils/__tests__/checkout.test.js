import moment from 'moment';
import { getNextShippingTimeAsText, orderToStep } from '../checkout';

const createTiming = (type, range, fast, diff) => ({
  [type]: { range, fast, diff },
});

describe('getNextShippingTimeAsText', () => {
  it('returns expected results', () => {
    const delivery = ['2020-02-12T18:55:00+01:00', '2020-02-12T19:05:00+01:00'];

    const collection = [
      '2020-02-12T19:55:00+01:00',
      '2020-02-12T20:05:00+01:00',
    ];

    expect(
      getNextShippingTimeAsText(
        { timing: createTiming('delivery', delivery, false, '115 - 125') },
        moment.parseZone('2020-02-12T17:00:00+01:00'),
      ),
    ).toEqual('Today at 6:55 PM');

    expect(
      getNextShippingTimeAsText(
        { timing: createTiming('delivery', delivery, true, '15 - 20') },
        moment.parseZone('2020-02-12T18:40:00+01:00'),
      ),
    ).toEqual('15 - 20 minutes');

    expect(
      getNextShippingTimeAsText(
        { timing: createTiming('collection', collection, false, '175 - 185') },
        moment.parseZone('2020-02-12T17:00:00+01:00'),
      ),
    ).toEqual('Today at 7:55 PM');

    expect(
      getNextShippingTimeAsText(
        { timing: createTiming('collection', collection, true, '15 - 20') },
        moment.parseZone('2020-02-12T19:40:00+01:00'),
      ),
    ).toEqual('15 - 20 minutes');

    const timingWithBoth = {
      ...createTiming('delivery', delivery, false),
      ...createTiming('collection', collection, false),
    };

    expect(
      getNextShippingTimeAsText(
        { timing: timingWithBoth },
        moment.parseZone('2020-02-12T17:00:00+01:00'),
      ),
    ).toEqual('Today at 6:55 PM');
  });
});

describe('OrderTracking', () => {
  it('should parse based on state', () => {
    expect(orderToStep({ state: 'accepted' })).toEqual({
      error: 0,
      index: 1,
      legacy: true,
    });
    expect(orderToStep({ state: 'refused' })).toEqual({
      error: 1,
      index: 1,
      legacy: true,
    });
    expect(orderToStep({ state: 'cancelled' })).toEqual({
      error: 2,
      index: 2,
      legacy: true,
    });
  });

  it('should parse based on events', () => {
    expect(orderToStep({ events: [{ type: 'order:accepted' }] })).toEqual({
      error: 0,
      index: 1,
      legacy: false,
    });

    expect(
      orderToStep({
        events: [{ type: 'order:accepted' }, { type: 'order:picked' }],
      }),
    ).toEqual({ error: 0, index: 2, legacy: false });

    expect(
      orderToStep({
        events: [
          { type: 'order:accepted' },
          { type: 'order:picked' },
          { type: 'order:cancelled' },
        ],
      }),
    ).toEqual({ error: 2, index: 2, legacy: false });

    expect(
      orderToStep({
        events: [
          { type: 'order:accepted' },
          { type: 'order:picked' },
          { type: 'order:refused' },
        ],
      }),
    ).toEqual({ error: 1, index: 1, legacy: false });

    expect(
      orderToStep({
        events: [
          { type: 'order:accepted' },
          { type: 'order:refused' },
          { type: 'order:picked' },
        ],
      }),
    ).toEqual({ error: 1, index: 1, legacy: false });

    expect(
      orderToStep({
        events: [{ type: 'order:picked' }, { type: 'order:accepted' }],
      }),
    ).toEqual({ error: 0, index: 2, legacy: false });
  });
});
