import { createAction } from 'redux-actions';

import { updateTask } from '../../Dispatch/actions';

export const CONNECT = '@centrifugo/CONNECT';
export const CENTRIFUGO_MESSAGE = '@centrifugo/MESSAGE';
export const CONNECTED = '@centrifugo/CONNECTED';
export const DISCONNECTED = '@centrifugo/DISCONNECTED';

export const connect = createAction(CONNECT);

export const connected = createAction(CONNECTED);
export const disconnected = createAction(DISCONNECTED);

export const _message = createAction(CENTRIFUGO_MESSAGE);

export function message(payload) {
  return function (dispatch, getState) {
    if (payload.name && payload.data) {
      const { name, data } = payload;

      switch (name) {
        case 'task:created':
        case 'task:cancelled':
        case 'task:assigned':
        case 'task:unassigned':
        case 'task:started':
        case 'task:done':
        case 'task:failed':
          dispatch(updateTask(name, data.task));
          break;
        default:
          dispatch(_message(payload));
          break;
      }
    } else {
      dispatch(_message(payload));
    }
  };
}
