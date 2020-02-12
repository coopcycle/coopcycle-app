import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createAction } from 'redux-actions'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import middleware from '..'
import AppUser from '../../../../AppUser'
import { SET_USER } from '../../../../redux/App/actions'
import appReducer from '../../../../redux/App/reducers'

const setUser = createAction(SET_USER)

// BackgroundGeolocation.getConfig = jest.fn()
//   .mockImplementation(cb => cb({ foo: 'bar' }))

describe('GeolocationMiddleware', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('configures background geolocation', () => {

    const preloadedState = {
      app: {
        user: null,
      },
    }

    const store = createStore(state => state, preloadedState, applyMiddleware(middleware))

    store.dispatch({ type: 'DUMMY' })

    expect(BackgroundGeolocation.configure).toHaveBeenCalledTimes(1)
    expect(BackgroundGeolocation.start).not.toHaveBeenCalled()
  })

  it('does nothing when user has not changed', () => {

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

    store.dispatch({ type: 'DUMMY' })

    expect(BackgroundGeolocation.configure).toHaveBeenCalledTimes(1)
    expect(BackgroundGeolocation.start).not.toHaveBeenCalled()
  })

  it('configures background geolocation sync', () => {

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

    expect(BackgroundGeolocation.configure).toHaveBeenCalledTimes(2)
    expect(BackgroundGeolocation.configure).toHaveBeenLastCalledWith({
      url: 'https://demo.coopcycle.org/api/me/location',
      syncUrl: 'https://demo.coopcycle.org/api/me/location',
      httpHeaders: {
        'Authorization': 'Bearer 123456',
        'Content-Type': 'application/ld+json',
      },
      postTemplate: {
        latitude: '@latitude',
        longitude: '@longitude',
        time: '@time',
      },
    })
    expect(BackgroundGeolocation.removeAllListeners).toHaveBeenCalledTimes(1)
    expect(BackgroundGeolocation.on).toHaveBeenCalledWith('http_authorization', expect.any(Function))

    expect(BackgroundGeolocation.start).toHaveBeenCalledTimes(1)
  })

  it('reconfigures background geolocation sync on token refresh', () => {

    const prevUser = new AppUser('foo', 'foo@coopcycle.org', '123456', ['ROLE_COURIER'])

    const preloadedState = {
      app: {
        baseURL: 'https://demo.coopcycle.org',
        user: prevUser,
      },
    }

    const reducer = combineReducers({
      app: appReducer,
    })

    const store = createStore(reducer, preloadedState, applyMiddleware(middleware))

    const user = new AppUser('foo', 'foo@coopcycle.org', '654321', ['ROLE_COURIER'])

    store.dispatch(setUser(user))

    expect(BackgroundGeolocation.configure).toHaveBeenCalledTimes(2)
    expect(BackgroundGeolocation.configure).toHaveBeenLastCalledWith({
      url: 'https://demo.coopcycle.org/api/me/location',
      syncUrl: 'https://demo.coopcycle.org/api/me/location',
      httpHeaders: {
        'Authorization': 'Bearer 654321',
        'Content-Type': 'application/ld+json',
      },
      postTemplate: {
        latitude: '@latitude',
        longitude: '@longitude',
        time: '@time',
      },
    })
    expect(BackgroundGeolocation.removeAllListeners).toHaveBeenCalledTimes(1)
    expect(BackgroundGeolocation.on).toHaveBeenCalledWith('http_authorization', expect.any(Function))

    expect(BackgroundGeolocation.start).toHaveBeenCalledTimes(1)
  })

  it('stops background geolocation on logout', () => {

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

    expect(BackgroundGeolocation.configure).toHaveBeenCalledTimes(2)
    expect(BackgroundGeolocation.configure).toHaveBeenLastCalledWith({
      url: null,
      syncUrl: null,
      httpHeaders: {},
      postTemplate: {},
    })
    expect(BackgroundGeolocation.removeAllListeners).toHaveBeenCalledTimes(5)
    expect(BackgroundGeolocation.stop).toHaveBeenCalledTimes(1)
  })

})
