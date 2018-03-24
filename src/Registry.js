import WebSocketClient from './websocket/WebSocketClient'

let webSocketClient

class Registry {

  static initWebSocketClient(client) {
    webSocketClient = new WebSocketClient(client, '/dispatch')
    return webSocketClient.connect()
  }

  static getWebSocketClient() {
    return webSocketClient
  }

  static clearWebSocketClient() {
    if (webSocketClient) {
      webSocketClient.disconnect()
    }
  }

}

module.exports = { Registry }
