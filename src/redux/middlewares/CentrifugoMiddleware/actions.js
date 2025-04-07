import { createAction } from '@reduxjs/toolkit';
import { updateTask } from '../../Dispatch/actions';

export const CENTRIFUGO_MESSAGE = '@centrifugo/MESSAGE';

export const connectCentrifugo = createAction('@centrifugo/CONNECT');
export const disconnectCentrifugo = createAction('@centrifugo/DISCONNECT');

export const centrifugoConnected = createAction('@centrifugo/CONNECTED');
export const centrifugoDisconnected = createAction('@centrifugo/DISCONNECTED');

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
        case 'task:updated':
          dispatch(updateTask(name, data.task));
          break;
        case 'v2:task_list:updated':
          dispatch(updateTaskList(name, data.task_list));
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
