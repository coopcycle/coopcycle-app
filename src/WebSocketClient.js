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
  closeCount = 0

  onCloseHandler = null
  onOpenHandler = null
  onMessageHandler = null

  constructor(client, uri, options) {
    this.client = client
    this.uri = uri
    this.options = options
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
      this.webSocket.removeEventListener('open', this.onOpenHandler)
      this.webSocket.removeEventListener('close', this.onCloseHandler)
      this.webSocket.removeEventListener('message', this.onMessageHandler)
    }

    // This is needed for removeEventListener to work
    this.onOpenHandler = this.onOpen.bind(this, resolve)
    this.onCloseHandler = this.onClose.bind(this, resolve, reject)
    this.onMessageHandler = this.onMessage.bind(this)

    this.webSocket = new WebSocket(socketURL, '', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    this.webSocket.addEventListener('open', this.onOpenHandler)
    this.webSocket.addEventListener('close', this.onCloseHandler)
    this.webSocket.addEventListener('message', this.onMessageHandler)
  }

  reconnect(resolve, reject) {

    console.log('Reconnecting')

    this.client.checkToken()
      .then(() => this.createWebSocket(resolve, reject))
      .catch(() => {
        this.client.refreshToken()
          .then(token => this.createWebSocket(resolve, reject))
      })

  }

  disconnect() {
    this.webSocket.removeEventListener('open', this.onOpenHandler)
    this.webSocket.removeEventListener('close', this.onCloseHandler)
    this.webSocket.removeEventListener('message', this.onMessageHandler)
    this.webSocket.close(1000)
  }

  onMessage (event) {
    this.options.onMessage(event)
  }

  onOpen(resolve, event) {

    console.log('Connection open')
    this.openCount = this.openCount + 1
    this.closeCount = 0

    this.options.onConnect()
    if (this.openCount > 1) {
      this.options.onReconnect()
    }

    resolve()
  }

  onClose(resolve, reject, event) {

    console.log('Connection close', event)
    this.closeCount = this.closeCount + 1

    this.options.onDisconnect()

    if (this.closeCount >= 5) {
      this.disconnect()
      reject()
      return
    }

    setTimeout(() => this.reconnect(resolve, reject), 1500)
  }

  isOpen() {
    return this.webSocket.readyState === WebSocket.OPEN
  }

  send(data) {
    if (this.isOpen()) {
      this.webSocket.send(JSON.stringify(data))
    }
  }

}

module.exports = WebSocketClient
