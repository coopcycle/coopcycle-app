/*
 * WebSocket client
 *
 * This client uses AsyncStorage to cache messages while the connection is closed
 * Once the connection is open again, the messages are sent and the queue is emptied
 */
import ReconnectingWebSocket from 'reconnecting-websocket'

// @see https://github.com/pladaria/reconnecting-websocket/issues/138
function createWebSocketClass(options) {
  return class extends WebSocket {
    constructor(url, protocols) {
      super(url, protocols, options)
    }
  }
}

class WebSocketClient {

  client = null
  uri = ''
  webSocket = null
  options = {
    onConnect: () => {},
    onDisconnect: () => {},
    onReconnect: () => {},
    onMessage: (message) => {},
  }

  openCount = 0

  onCloseHandler = null
  onOpenHandler = null
  onMessageHandler = null
  onErrorHandler = null

  constructor(client, uri, opts = {}) {
    this.client = client
    this.uri = uri
    this.options = { ...this.options, ...opts }
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.createWebSocket(resolve, reject)
    })
  }

  createWebSocket(resolve, reject) {

    const socketURL = (this.client.getBaseURL().replace('http', 'ws')) + this.uri
    const token = this.client.getToken()

    console.log(`Connecting to socket ${socketURL}`)

    if (this.webSocket !== null) {
      this.webSocket.removeEventListener('open',    this.onOpenHandler)
      this.webSocket.removeEventListener('close',   this.onCloseHandler)
      this.webSocket.removeEventListener('message', this.onMessageHandler)
      this.webSocket.removeEventListener('error',   this.onErrorHandler)
    }

    // This is needed for removeEventListener to work
    this.onOpenHandler    = this.onOpen.bind(this, resolve)
    this.onCloseHandler   = this.onClose.bind(this, resolve, reject)
    this.onMessageHandler = this.onMessage.bind(this)
    this.onErrorHandler   = this.onError.bind(this, resolve, reject)

    this.webSocket = new ReconnectingWebSocket(socketURL, '', {
      WebSocket: createWebSocketClass({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      debug: __DEV__,
    });

    this.webSocket.addEventListener('open',    this.onOpenHandler)
    this.webSocket.addEventListener('close',   this.onCloseHandler)
    this.webSocket.addEventListener('message', this.onMessageHandler)
    this.webSocket.addEventListener('error',   this.onErrorHandler)
  }

  disconnect() {
    this.webSocket.removeEventListener('open',    this.onOpenHandler)
    this.webSocket.removeEventListener('close',   this.onCloseHandler)
    this.webSocket.removeEventListener('message', this.onMessageHandler)
    this.webSocket.removeEventListener('error',   this.onErrorHandler)
    this.webSocket.close()
  }

  onMessage(event) {
    this.options.onMessage(event)
  }

  onOpen(resolve, event) {

    console.log('Connection open')

    this.openCount = this.openCount + 1

    this.options.onConnect(event)

    if (this.openCount > 1) {
      this.options.onReconnect(event)
    }

    resolve()
  }

  onClose(resolve, reject, event) {

    console.log('WebSocket closed')

    this.options.onDisconnect(event)
  }

  onError(resolve, reject, error) {
    // When the token is not valid,
    // error.message is "Expected HTTP 101 response but was '401 Unauthorized'"
    if (/401 Unauthorized/.test(error.message) || /401/.test(error.message)) {

      this.disconnect()

      this.client.refreshToken()
        .then(() => {
          this.createWebSocket(resolve, reject)
        })
        .catch((e) => {
          reject(e)
        })
    }
  }

  isOpen() {
    return this.webSocket && this.webSocket.readyState === WebSocket.OPEN
  }

  send(data) {
    return this.webSocket.send(JSON.stringify(data))
  }

}

module.exports = WebSocketClient
