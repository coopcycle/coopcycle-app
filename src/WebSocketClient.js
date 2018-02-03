class WebSocketClient {

  socketURL = ''
  user = null
  webSocket = null
  options = {
    onConnect: () => {},
    onDisconnect: () => {},
    onReconnect: () => {}
  }
  isDisconnecting = false

  constructor(socketURL, user, options) {
    this.socketURL = socketURL
    this.user = user
    this.options = options
  }

  connect() {

    const wasConnected = this.webSocket !== null

    return new Promise((resolve, reject) => {

      console.log(`Connecting to socket ${this.socketURL}`)

      if (wasConnected) {
        console.log(`Removing previous event listeners`)
        this.webSocket.removeEventListener('open', this.onOpen.bind(this))
        this.webSocket.removeEventListener('close', this.onClose.bind(this))
      }

      this.webSocket = new WebSocket(this.socketURL, '', {
        headers: {
          Authorization: `Bearer ${this.user.token}`
        }
      })

      this.webSocket.addEventListener('open', event => {
        this.onOpen()
        if (wasConnected) {
          this.options.onReconnect()
        }
        resolve()
      })

      this.webSocket.addEventListener('close', this.onClose.bind(this))
    })

  }

  disconnect() {
    this.isDisconnecting = true
    this.webSocket.removeEventListener('close', this.onClose.bind(this))
    this.webSocket.close(1000)
  }

  onOpen(event) {
    console.log('Connection open')
    this.options.onConnect()
  }

  onClose(event) {
    if (!this.isDisconnecting) {
      this.options.onDisconnect()
      console.log('Connection closed, reconnecting', event.code)
      setTimeout(() => this.connect(), 500)
    }
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
