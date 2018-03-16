import reducer from '../reducers'
import { omit } from 'lodash'
import { connected, disconnected, reconnected } from '../../middlewares/WebSocketMiddleware'

describe('Redux | App | Reducers', () => {
  test(`${connected}`, () => {
    const initialState = reducer(undefined, {})
    const newState = reducer(initialState, connected())

    const restOldState = omit(initialState, ['isWsOpen'])
    const restNewState = omit(newState, ['isWsOpen'])

    expect(newState).toEqual(expect.objectContaining({
      isWsOpen: true,
    }))
    expect(restNewState).toEqual(restOldState)
  })

  test(`${reconnected}`, () => {
    const initialState = reducer(undefined, {})
    const newState = reducer(initialState, reconnected())

    const restOldState = omit(initialState, ['isWsOpen'])
    const restNewState = omit(newState, ['isWsOpen'])

    expect(newState).toEqual(expect.objectContaining({
      isWsOpen: true,
    }))
    expect(restNewState).toEqual(restOldState)
  })

  test(`${disconnected}`, () => {
    const initialState = {
      ...reducer(undefined, {}),
      isWsOpen: true,
    }
    const newState = reducer(initialState, disconnected())

    const restOldState = omit(initialState, ['isWsOpen'])
    const restNewState = omit(newState, ['isWsOpen'])

    expect(newState).toEqual(expect.objectContaining({
      isWsOpen: false,
    }))
    expect(restNewState).toEqual(restOldState)
  })
})
