import AsyncStorage from '@react-native-community/async-storage'
import WebSocketClient from '../WebSocketClient'

describe('WebSocketClient', () => {

  beforeEach(() => {
    AsyncStorage.clear()
  })

  const client = {
    getBaseURL: () => 'http://foo.com',
    getToken: () => 'iot9384htgonrqdq',
    checkToken: jest.fn(),
    refreshToken: jest.fn(),
  }

  class MockWebSocket {
    url = ''
    listeners = {}
    readyState = 3
    _last_msg = ''
    _last_code = 0

    constructor (url) {
      this.url = url;
    }

    addEventListener (channel, fn) {
      (this.listeners[channel] = this.listeners[channel] || []).unshift(fn)
    }

    removeEventListener (channel, fn) {
      this.listeners[channel] = (this.listeners[channel] || []).filter(f => f !== fn)
    }

    send (msg) {
      this._last_msg = msg
    }

    close (code) {
      this._last_code = code
      this._closing()
      this._close()
    }

    _connecting () {
      this.readyState = 0
    }

    _open () {
      this.readyState = 1;
      (this.listeners.open || []).forEach(fn => fn({}))
    }

    _closing () {
      this.readyState = 2
    }

    _close () {
      this.readyState = 3;
      (this.listeners.close || []).forEach(fn => fn())
    }

    _message () {
      this.readyState = 1;
      (this.listeners.message || []).forEach(fn => fn())
    }

    _error() {
      (this.listeners.error || []).forEach(fn => fn())
    }
  }
  MockWebSocket.CONNECTING = 0
  MockWebSocket.OPEN = 1
  MockWebSocket.CLOSING = 2
  MockWebSocket.CLOSED = 3

  let temp = null

  beforeAll(() => {
    temp = global.WebSocket
    global.WebSocket = MockWebSocket
  })

  afterAll(() => {
    global.WebSocket = temp
    temp = null
    jest.unmock('AsyncStorage')
  })

  beforeEach(() => jest.resetAllMocks())


  test('constructor', () => {
    const ws = new WebSocketClient(client, '/dispatch')

    expect(ws).toBeInstanceOf(WebSocketClient)
  })

  test.skip('connect', () => {
    const ws = new WebSocketClient(client, '/dispatch')

    const promise = ws.connect()
      .then(() => {
        expect(ws.openCount).toBe(1)
        expect(ws.closeCount).toBe(0)
        expect(ws.isOpen()).toBeTruthy()
      })

    ws.webSocket._open()

    return promise
  })

  test.skip('send | online', () => {
    const ws = new WebSocketClient(client, '/dispatch')
    const msg = { foo: true }

    const promise = ws.connect()
      .then(() => {
        ws.send(msg)

        expect(ws.webSocket._last_msg).toBe(JSON.stringify(msg))
      })

    ws.webSocket._open()

    return promise
  })

  test.skip('send | offline | pre-connect', () => {
    const ws = new WebSocketClient(client, '/dispatch')
    const msg = { foo: true }

    return ws.send(msg)
      .then(async () => {
        const value = await AsyncStorage.getItem('@WsMsgQueue')
        expect(value).toBe(JSON.stringify([msg]))
      })
  })

  test.skip('send | offline | post-connect', () => {
    const ws = new WebSocketClient(client, '/dispatch')
    const msg = { foo: true }

    const promise = ws.connect()
      .then(() => {
        // Simulate disconnection
        ws.webSocket.readyState = MockWebSocket.CLOSING

        return ws.send(msg)
      })
      .then(async () => {
        const value = await AsyncStorage.getItem('@WsMsgQueue')
        expect(value).toBe(JSON.stringify([msg]))
      })

    ws.webSocket._open()

    return promise
  })
})
