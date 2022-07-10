import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createAction } from 'redux-actions'
import BackgroundGeolocation from 'react-native-background-geolocation'
import thunk from 'redux-thunk'

import middleware from '../index'
import AppUser from '../../../../AppUser'
import { SET_USER } from '../../../../redux/App/actions'
import appReducer from '../../../../redux/App/reducers'

const setUser = createAction(SET_USER)

// This needs to be defined here to be "mockable"

let onEnabledChangeCallback
BackgroundGeolocation.onEnabledChange.mockImplementation((callback) => {
  onEnabledChangeCallback = callback
})

describe('GeolocationMiddleware', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('does not start background geolocation if already started', async () => {

    BackgroundGeolocation.ready.mockImplementation((options, callback) => {
      callback({ enabled: true })
    })

    const preloadedState = {
      app: {
        baseURL: 'https://demo.coopcycle.org',
        user: null,
        isBackgroundGeolocationEnabled: true,
      },
    }

    const reducer = combineReducers({
      app: appReducer,
    })

    const store = createStore(reducer, preloadedState, applyMiddleware(middleware))

    const user = new AppUser('foo', 'foo@coopcycle.org', '123456', ['ROLE_COURIER'])
    store.dispatch(setUser(user))

    expect(BackgroundGeolocation.ready).toHaveBeenCalledTimes(1)
    expect(BackgroundGeolocation.start).toHaveBeenCalledTimes(0)

    const newState = store.getState()

    expect(newState.app.isBackgroundGeolocationEnabled).toBe(true)
  })

  it('starts background geolocation if not started', () => {

    // Change Jest timeout limit,
    // because we are calling changePace with setTimeout
    jest.setTimeout(30000)

    const preloadedState = {
      app: {
        baseURL: 'https://demo.coopcycle.org',
        user: null,
        hasDisclosedBackgroundPermission: true,
      },
    }

    const reducer = combineReducers({
      app: appReducer,
    })

    const store = createStore(reducer, preloadedState, applyMiddleware(...[ thunk, middleware ]))

    return new Promise((resolve, reject) => {

      BackgroundGeolocation.ready.mockImplementation((options, callback) => {
        callback({ enabled: false })
      })
      BackgroundGeolocation.start.mockImplementation((callback) => {
        onEnabledChangeCallback(true)
        callback()
      })
      BackgroundGeolocation.changePace.mockImplementation((moving) => {
        resolve()
      })

      const user = new AppUser('foo', 'foo@coopcycle.org', '123456', ['ROLE_COURIER'])

      store.dispatch(setUser(user))

    }).then(() => {

      expect(BackgroundGeolocation.ready).toHaveBeenCalledTimes(1)
      expect(BackgroundGeolocation.start).toHaveBeenCalledTimes(1)

      const newState = store.getState()

      expect(newState.app.isBackgroundGeolocationEnabled).toBe(true)
    })
  })

  it('stops background geolocation on logout', async () => {

    BackgroundGeolocation.stop.mockImplementation(() => {
      onEnabledChangeCallback(false)
    })

    const user = new AppUser('foo', 'foo@coopcycle.org', '123456', ['ROLE_COURIER'])

    const preloadedState = {
      app: {
        baseURL: 'https://demo.coopcycle.org',
        user,
      },
    }

    const reducer = combineReducers({
      app: appReducer,
    })

    const store = createStore(reducer, preloadedState, applyMiddleware(middleware))

    store.dispatch(setUser(null))

    expect(BackgroundGeolocation.stop).toHaveBeenCalledTimes(1)
    expect(BackgroundGeolocation.removeListeners).toHaveBeenCalledTimes(1)

    const newState = store.getState()

    expect(newState.app.isBackgroundGeolocationEnabled).toBe(false)
  })
})
