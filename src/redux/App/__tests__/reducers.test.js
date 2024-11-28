import { omit } from 'lodash';
import {
  centrifugoConnected,
  centrifugoDisconnected,
} from '../../middlewares/CentrifugoMiddleware';
import reducer from '../reducers';

describe('Redux | App | Reducers', () => {
  test(`${centrifugoConnected}`, () => {
    const initialState = reducer(undefined, {});
    const newState = reducer(initialState, centrifugoConnected());

    const restOldState = omit(initialState, ['isCentrifugoConnected']);
    const restNewState = omit(newState, ['isCentrifugoConnected']);

    expect(newState).toEqual(
      expect.objectContaining({
        isCentrifugoConnected: true,
      }),
    );
    expect(restNewState).toEqual(restOldState);
  });

  test(`${centrifugoDisconnected}`, () => {
    const initialState = {
      ...reducer(undefined, {}),
      isCentrifugoConnected: true,
    };
    const newState = reducer(initialState, centrifugoDisconnected());

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
