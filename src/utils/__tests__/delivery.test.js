import { composeWithState, resolveState } from '../delivery';

describe('resolveState', () => {
  it('returns expected results', () => {
    expect(
      resolveState({
        pickup: {},
        dropoff: {},
      }),
    ).toEqual('unknown');

    expect(
      resolveState({
        pickup: { status: 'TODO' },
        dropoff: { status: 'TODO' },
      }),
    ).toEqual('new');

    expect(
      resolveState({
        pickup: { status: 'DONE' },
        dropoff: { status: 'TODO' },
      }),
    ).toEqual('picked');

    expect(
      resolveState({
        pickup: { status: 'DONE' },
        dropoff: { status: 'DONE' },
      }),
    ).toEqual('fulfilled');
  });
});

describe('composeWithState', () => {
  it('returns expected results', () => {
    expect(
      composeWithState({
        pickup: {},
        dropoff: {},
      }),
    ).toEqual({
      pickup: {},
      dropoff: {},
      state: 'unknown',
    });

    expect(
      composeWithState({
        pickup: { status: 'TODO' },
        dropoff: { status: 'TODO' },
      }),
    ).toEqual({
      pickup: { status: 'TODO' },
      dropoff: { status: 'TODO' },
      state: 'new',
    });

    expect(
      composeWithState({
        pickup: { status: 'DONE' },
        dropoff: { status: 'TODO' },
      }),
    ).toEqual({
      pickup: { status: 'DONE' },
      dropoff: { status: 'TODO' },
      state: 'picked',
    });

    expect(
      composeWithState({
        pickup: { status: 'DONE' },
        dropoff: { status: 'DONE' },
      }),
    ).toEqual({
      pickup: { status: 'DONE' },
      dropoff: { status: 'DONE' },
      state: 'fulfilled',
    });
  });
});
