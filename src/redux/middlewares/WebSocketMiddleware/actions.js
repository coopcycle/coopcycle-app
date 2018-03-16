import { createAction } from 'redux-actions'

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
export const message = createAction(MESSAGE)
export const error = createAction(ERROR)
