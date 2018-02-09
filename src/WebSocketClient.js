class WebSocketClient {

  client = null
  uri = ''
  webSocket = null
  options = {
    onConnect: () => {},
    onDisconnect: () => {},
    onReconnect: () => {}
  }

  openCount = 0
  closeCount = 0

  onCloseHandler = null
  onOpenHandler = null

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
      console.log(`Removing previous event listeners`)
      this.webSocket.removeEventListener('open', this.onOpenHandler)
      this.webSocket.removeEventListener('close', this.onCloseHandler)
    }

    // This is needed for removeEventListener to work
    this.onOpenHandler = this.onOpen.bind(this, resolve)
    this.onCloseHandler = this.onClose.bind(this, resolve, reject)

    this.webSocket = new WebSocket(socketURL, '', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    this.webSocket.addEventListener('open', this.onOpenHandler)
    this.webSocket.addEventListener('close', this.onCloseHandler)

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
    this.webSocket.close(1000)
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
