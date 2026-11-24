import moment from 'moment';
import {
  getNextShippingTime,
  getNextShippingTimeAsText,
  hasShippingTime,
  isRestaurantOrderingAvailable,
  orderToStep,
  shouldShowPreOrder,
} from '../checkout';

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

describe('a shop whose timing has not been fetched yet', () => {
  // Timing is loaded per shop, as its card scrolls into view, so every helper
  // has to cope with a shop that does not carry it yet.
  const pending = { '@id': '/api/restaurants/1', name: 'Pending' };

  it('is told apart from a shop with no slot', () => {
    expect(hasShippingTime(pending)).toBe(false);
    expect(hasShippingTime({ ...pending, timing: {} })).toBe(true);
  });

  it('does not throw from the timing helpers', () => {
    expect(getNextShippingTime(pending)).toBeNull();
    expect(isRestaurantOrderingAvailable(pending)).toBe(false);
    expect(shouldShowPreOrder(pending)).toBe(false);
  });
});
