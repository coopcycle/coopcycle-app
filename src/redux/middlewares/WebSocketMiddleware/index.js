/*
 * WebSocket Redux Middleware
 *
 * Allows interaction with the WebSocketClient purely via dispatching
 * and reacting to actions
 *
 * The middleware exports three action-types which it will intercept
 * and perform the appropraite calls on the WebSocketClient:
 * - INIT        -- Initialises the middleware with hte WebSocket client
 *                  This is useful if it's not possible to initialise the
 *                  middleware when it's first created
 * - CONNECT     -- Instructs client to open the WebSocket connection
 * - DISCONNECT  -- Instructs client to close the WebSocket connection
 * - SEND        -- Instructs client to send the message in the payload
 *                  over the WebSocket connection
 *
 * For convenience, action creators for these are exported
 *
 * Other parts of the application may respond to WebSocket messages by
 * adding a switch-case statement to their reducers for the action type
 * `MESSAGE`, exported from this file. Message payloads are JSON-parsed
 * if possible.
 *
 * The full list of action types which are exported to help the application
 * respond to WebSocket events are:
 * - CONNECTED
 * - DISCONNECTED
 * - RECONNECTED
 * - MESSAGE
 * - ERROR
 */
import {
  INIT,
  CONNECT, DISCONNECT, SEND,
  CONNECTED, DISCONNECTED, RECONNECTED, MESSAGE, ERROR,
  init,
  connect, disconnect, send,
  connected, disconnected, reconnected, message, error,
} from './actions'
import { safeJsonParse } from './util'
import { isWsAction, validateAction } from './validation'


const defaultOptions = {
  client: null,
}

const attachListeners = (client, dispatch) => {
  client.options.onConnect = (event) => dispatch(connected(event))
  client.options.onReconnect = (event) => dispatch(reconnected(event))
  client.options.onDisconnect = (event) => dispatch(disconnected(event))
  client.options.onMessage = (event) => dispatch(message(safeJsonParse(event.data)))
}

/**
 * Creates a middleware to handle websocket interactions via
 * actions
 * @param   {Object}          [options]         Configuration options object
 * @param   {WebSocketClient} [options.client]  Wrapper around native WebSocket client
 * @returns {ReduxMiddleware}                   Redux middleware
 */
export default (options = {}) => ({ dispatch }) => {

  const opts = { ...defaultOptions, ...options }

  let isInitialised = false
  let client = opts.client || null

  if (client) {
    attachListeners(client, dispatch)
    isInitialised = true
  }

  return (next) => (action) => {
    if (! isWsAction(action)) {
      return next(action)
    }

    validateAction(action)

    switch (action.type) {
      case INIT:
        if (! isInitialised) {
          attachListeners(action.payload, dispatch)
          client = action.payload
          isInitialised = true
        }

        if (client.isOpen()) {
          dispatch(connected())
        }
        return

      case CONNECT:
        return client
          ? client.connect()
          : dispatch(error(new Error('Client has not yet been set')))

      case DISCONNECT:
        return client
          ? client.disconnect()
          : dispatch(error(new Error('Client has not yet been set')))

      case SEND:
        return client
          ? client.send(action.payload)
          : dispatch(error(new Error('Client has not yet been set')))

      default:
        return next(action)
    }
  }
}

export {
  INIT,
  CONNECT, DISCONNECT, SEND,
  CONNECTED, DISCONNECTED, RECONNECTED, MESSAGE, ERROR,
  init,
  connect, disconnect, send,
  connected, disconnected, reconnected, message, error,
}
