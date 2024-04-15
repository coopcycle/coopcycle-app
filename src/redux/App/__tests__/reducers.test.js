import reducer from '../reducers';
import { omit } from 'lodash';
import {
  connected,
  disconnected,
} from '../../middlewares/CentrifugoMiddleware';

describe('Redux | App | Reducers', () => {
  test(`${connected}`, () => {
    const initialState = reducer(undefined, {});
    const newState = reducer(initialState, connected());

    const restOldState = omit(initialState, ['isCentrifugoConnected']);
    const restNewState = omit(newState, ['isCentrifugoConnected']);

    expect(newState).toEqual(
      expect.objectContaining({
        isCentrifugoConnected: true,
      }),
    );
    expect(restNewState).toEqual(restOldState);
  });

  test(`${disconnected}`, () => {
    const initialState = {
      ...reducer(undefined, {}),
      isCentrifugoConnected: true,
    };
    const newState = reducer(initialState, disconnected());

    const restOldState = omit(initialState, ['isCentrifugoConnected']);
    const restNewState = omit(newState, ['isCentrifugoConnected']);

    expect(newState).toEqual(
      expect.objectContaining({
        isCentrifugoConnected: false,
      }),
    );
    expect(restNewState).toEqual(restOldState);
  });
});
