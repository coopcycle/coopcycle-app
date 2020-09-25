import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createAction } from 'redux-actions'
import BackgroundGeolocation from 'react-native-background-geolocation'
import middleware from '../index'
import AppUser from '../../../../AppUser'
import { SET_USER } from '../../../../redux/App/actions'
import appReducer from '../../../../redux/App/reducers'

const setUser = createAction(SET_USER)

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

  it('starts background geolocation if not started', async () => {

    let onEnabledChangeCallback

    BackgroundGeolocation.onEnabledChange.mockImplementation((callback) => {
      onEnabledChangeCallback = callback
    })
    BackgroundGeolocation.ready.mockImplementation((options, callback) => {
      callback({ enabled: false })
    })
    BackgroundGeolocation.start.mockImplementation(() => {
      onEnabledChangeCallback(true)
    })

    const preloadedState = {
      app: {
        baseURL: 'https://demo.coopcycle.org',
        user: null,
      },
    }

    const reducer = combineReducers({
      app: appReducer,
    })

    const store = createStore(reducer, preloadedState, applyMiddleware(middleware))

    const user = new AppUser('foo', 'foo@coopcycle.org', '123456', ['ROLE_COURIER'])
    store.dispatch(setUser(user))

    expect(BackgroundGeolocation.ready).toHaveBeenCalledTimes(1)
    expect(BackgroundGeolocation.start).toHaveBeenCalledTimes(1)

    const newState = store.getState()

    expect(newState.app.isBackgroundGeolocationEnabled).toBe(true)
  })

  it('stops background geolocation on logout', async () => {

    let onEnabledChangeCallback

    BackgroundGeolocation.onEnabledChange.mockImplementation((callback) => {
      onEnabledChangeCallback = callback
    })
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
