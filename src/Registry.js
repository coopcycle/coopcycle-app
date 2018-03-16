import { Settings, events } from './Settings'
import WebSocketClient from './websocket/WebSocketClient'

let webSocketClient

class Registry {

  static initWebSocketClient(client) {
    webSocketClient = new WebSocketClient(client, '/dispatch', {
      onConnect: () => { events.emit('websocket:connect')},
      onDisconnect: () => { events.emit('websocket:disconnect')},
      onReconnect: () => { events.emit('websocket:reconnect')},
      onMessage: event => { events.emit('websocket:message', event)},
    })
    webSocketClient.connect()
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
