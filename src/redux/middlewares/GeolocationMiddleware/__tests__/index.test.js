import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createAction } from 'redux-actions'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import middleware from '../index.android.js'
import AppUser from '../../../../AppUser'
import { SET_USER } from '../../../../redux/App/actions'
import appReducer from '../../../../redux/App/reducers'

const setUser = createAction(SET_USER)

describe('GeolocationMiddleware', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('configures background task', () => {

    const preloadedState = {
      app: {
        user: null,
      },
    }

    const store = createStore(state => state, preloadedState, applyMiddleware(middleware))

    store.dispatch({ type: 'DUMMY' })

    expect(TaskManager.defineTask).toHaveBeenCalledTimes(1)
  })

  it('configures background geolocation sync', async () => {

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

    expect(TaskManager.defineTask).toHaveBeenCalledTimes(1)

    await expect(Location.hasServicesEnabledAsync()).resolves.toBe(true)
    await expect(Location.startLocationUpdatesAsync).toHaveBeenCalledTimes(1)

    const newState = store.getState()

    expect(newState.app.isBackgroundGeolocationEnabled).toBe(true)

  })

  it('stops background geolocation on logout', async () => {

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

    expect(TaskManager.defineTask).toHaveBeenCalledTimes(1)

    await expect(Location.hasStartedLocationUpdatesAsync()).resolves.toBe(true)
    await expect(Location.stopLocationUpdatesAsync).toHaveBeenCalledTimes(1)

    const newState = store.getState()

    expect(newState.app.isBackgroundGeolocationEnabled).toBe(false)
  })

})
