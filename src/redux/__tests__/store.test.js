import { createStore } from 'redux'
import { observeStore } from '../store'


describe('Redux | store', () => {
  let store = null
  let reducer = null
  let selector = null
  const subscriber = jest.fn()

  beforeEach(() => {
    selector = jest.fn((s) => s.foo)
    reducer = jest.fn((state = { foo: true }, action) => ({ ...state }))
    store = createStore(reducer)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('observeStore | no state change', () => {
    observeStore(store, selector, subscriber)

    store.dispatch({ type: 'foo' })

    expect(selector).toHaveBeenCalledTimes(2)
    expect(selector).toHaveBeenLastCalledWith({ foo: true })
    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenLastCalledWith(true)
  })

  test('observeStore | state change', () => {
    reducer.mockReturnValue({ foo: false })
    observeStore(store, selector, subscriber)

    store.dispatch({ type: 'foo' })

    expect(selector).toHaveBeenCalledTimes(2)
    expect(selector).toHaveBeenLastCalledWith({ foo: false })
    expect(subscriber).toHaveBeenCalledTimes(2)
    expect(subscriber).toHaveBeenLastCalledWith(false)
  })
})
