import { createAction } from 'redux-actions'
import {updateTask} from "../../Dispatch/actions";

export const INIT = '@ws/INIT'
export const CONNECT = '@ws/CONNECT'
export const DISCONNECT = '@ws/DISCONNECT'
export const SEND = '@ws/SEND'

export const CONNECTED = '@ws/CONNECTED'
export const DISCONNECTED = '@ws/DISCONNECTED'
export const RECONNECTED = '@ws/RECONNECTED'
export const MESSAGE = '@ws/MESSAGE'
export const ERROR = '@ws/ERROR'

export const init = createAction(INIT)
export const connect = createAction(CONNECT)
export const disconnect = createAction(DISCONNECT)
export const send = createAction(SEND)

export const connected = createAction(CONNECTED)
export const disconnected = createAction(DISCONNECTED)
export const reconnected = createAction(RECONNECTED)
export const error = createAction(ERROR)
const _message = createAction(MESSAGE)

export function message(payload) {
  return function (dispatch, getState) {
    if (payload.name && payload.data) {

      const {name, data} = payload

      switch (name) {
        case 'task:created':
        case 'task:cancelled':
        case 'task:assigned':
        case 'task:unassigned':
        case 'task:started':
        case 'task:done':
        case 'task:failed':
          dispatch(updateTask(name, data.task))
          break
        default:
          dispatch(_message(payload))
          break
      }
    }
  }
}
