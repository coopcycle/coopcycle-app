import { createStore, applyMiddleware } from 'redux'
import middleware, {
  init,
  connect, disconnect, send, message,
  connected, disconnected, reconnected,
} from '..'

describe('WebSocketMiddleware', () => {
  describe('Middleware | pre-initialised', () => {
    const client = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      send: jest.fn(),
      isOpen: jest.fn(),
      options: {},
    }

    const reducer = jest.fn()
    const store = createStore(reducer, applyMiddleware(middleware({ client })))

    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('Non-ws actions are ignored', () => {
      store.dispatch({ type: 'NOT_A_WS_ACTION' })

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(client.connect).not.toHaveBeenCalled()
      expect(client.disconnect).not.toHaveBeenCalled()
      expect(client.send).not.toHaveBeenCalled()
      expect(client.isOpen).not.toHaveBeenCalled()
    })

    test(`${connect}`, () => {
      store.dispatch(connect())

      expect(reducer).not.toHaveBeenCalled()
      expect(client.connect).toHaveBeenCalledTimes(1)
      expect(client.disconnect).not.toHaveBeenCalled()
      expect(client.send).not.toHaveBeenCalled()
      expect(client.isOpen).not.toHaveBeenCalled()
    })

    test(`${disconnect}`, () => {
      store.dispatch(disconnect())

      expect(reducer).not.toHaveBeenCalled()
      expect(client.connect).not.toHaveBeenCalled()
      expect(client.disconnect).toHaveBeenCalledTimes(1)
      expect(client.send).not.toHaveBeenCalled()
      expect(client.isOpen).not.toHaveBeenCalled()
    })

    test(`${send} | connected`, () => {
      const message = { data: 'foo' }
      client.isOpen.mockReturnValue(true)

      store.dispatch(send(message))

      expect(reducer).not.toHaveBeenCalled()
      expect(client.connect).not.toHaveBeenCalled()
      expect(client.disconnect).not.toHaveBeenCalled()
      expect(client.send).toHaveBeenCalledTimes(1)
      expect(client.isOpen).not.toHaveBeenCalledTimes(1)

      expect(client.send).toHaveBeenCalledWith(message)
    })

    test(`${send} | disconnected`, (done) => {
      const message = { data: 'foo' }
      client.isOpen.mockReturnValue(false)

      store.dispatch(send(message))

      process.nextTick(() => {
        expect(reducer).not.toHaveBeenCalled()
        expect(client.connect).not.toHaveBeenCalled()
        expect(client.disconnect).not.toHaveBeenCalled()
        expect(client.send).toHaveBeenCalledWith(message)
        expect(client.isOpen).not.toHaveBeenCalledTimes(1)

        done()
      })
    })

    test(`${connected}`, () => {
      const event = { foo: 'bar' }

      client.options.onConnect(event)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer).toHaveBeenLastCalledWith(undefined, connected(event))
      expect(client.connect).not.toHaveBeenCalled()
      expect(client.disconnect).not.toHaveBeenCalled()
      expect(client.send).not.toHaveBeenCalled()
      expect(client.isOpen).not.toHaveBeenCalled()
    })

    test(`${disconnected}`, () => {
      const event = { foo: 'bar' }

      client.options.onDisconnect(event)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer).toHaveBeenLastCalledWith(undefined, disconnected(event))
      expect(client.connect).not.toHaveBeenCalled()
      expect(client.disconnect).not.toHaveBeenCalled()
      expect(client.send).not.toHaveBeenCalled()
      expect(client.isOpen).not.toHaveBeenCalled()
    })

    test(`${reconnected}`, () => {
      const event = { foo: 'bar' }

      client.options.onReconnect(event)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer).toHaveBeenLastCalledWith(undefined, reconnected(event))
      expect(client.connect).not.toHaveBeenCalled()
      expect(client.disconnect).not.toHaveBeenCalled()
      expect(client.send).not.toHaveBeenCalled()
      expect(client.isOpen).not.toHaveBeenCalled()
    })

    test(`${message} | valid JSON`, () => {
      const event = { data: JSON.stringify({ foo: 1 }) }

      client.options.onMessage(event)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer).toHaveBeenLastCalledWith(undefined, message({ foo: 1 }))
      expect(client.connect).not.toHaveBeenCalled()
      expect(client.disconnect).not.toHaveBeenCalled()
      expect(client.send).not.toHaveBeenCalled()
      expect(client.isOpen).not.toHaveBeenCalled()
    })

    test(`${message} | invalid JSON`, () => {
      const event = { data: 'not valid json' }

      client.options.onMessage(event)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer).toHaveBeenLastCalledWith(undefined, message(event.data))
      expect(client.connect).not.toHaveBeenCalled()
      expect(client.disconnect).not.toHaveBeenCalled()
      expect(client.send).not.toHaveBeenCalled()
      expect(client.isOpen).not.toHaveBeenCalled()
    })
  })

  describe('Middleware | post-initialised', () => {
    const client = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      send: jest.fn(),
      isOpen: jest.fn(),
      options: {},
    }

    const reducer = jest.fn()
    const store = createStore(reducer, applyMiddleware(middleware()))

    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('Non-ws actions are ignored', () => {
      store.dispatch({ type: 'NOT_A_WS_ACTION' })

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(client.connect).not.toHaveBeenCalled()
      expect(client.disconnect).not.toHaveBeenCalled()
      expect(client.send).not.toHaveBeenCalled()
      expect(client.isOpen).not.toHaveBeenCalled()
    })

    test(`${init} | first call initialises`, () => {
      client.isOpen.mockReturnValue(true)

      store.dispatch(init(client))

      expect(client.options).toHaveProperty('onConnect')
      expect(client.options).toHaveProperty('onDisconnect')
      expect(client.options).toHaveProperty('onReconnect')
      expect(client.options).toHaveProperty('onMessage')
      expect(client.isOpen).toHaveBeenCalledTimes(1)
      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer).toHaveBeenLastCalledWith(undefined, connected())
    })

    test(`${init} | second call does nothing`, () => {
      client.isOpen.mockReturnValue(true)

      expect(client.options).toHaveProperty('onConnect')
      expect(client.options).toHaveProperty('onDisconnect')
      expect(client.options).toHaveProperty('onReconnect')
      expect(client.options).toHaveProperty('onMessage')

      const onConnect = client.options.onConnect
      const onDisconnect = client.options.onDisconnect
      const onReconnect = client.options.onReconnect
      const onMessage = client.options.onMessage

      store.dispatch(init(client))

      expect(client.isOpen).toHaveBeenCalledTimes(1)
      expect(reducer).toHaveBeenCalled(undefined, connected())
      expect(client.options.onConnect).toBe(onConnect)
      expect(client.options.onDisconnect).toBe(onDisconnect)
      expect(client.options.onReconnect).toBe(onReconnect)
      expect(client.options.onMessage).toBe(onMessage)
    })
  })
})
