import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createAction } from 'redux-actions'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import middleware from '..'
import AppUser from '../../../../AppUser'
import { SET_USER } from '../../../../redux/App/actions'
import appReducer from '../../../../redux/App/reducers'

const setUser = createAction(SET_USER)

describe('GeolocationMiddleware', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('configures background geolocation', () => {

    const preloadedState = {
      app: {
        user: null
      }
    }

    const store = createStore(state => state, preloadedState, applyMiddleware(middleware))

    store.dispatch({ type: 'DUMMY' })

    expect(BackgroundGeolocation.configure).toHaveBeenCalledTimes(1)
    expect(BackgroundGeolocation.start).not.toHaveBeenCalled()
  })

  it('configures background geolocation sync', () => {

    const preloadedState = {
      app: {
        baseURL: 'https://demo.coopcycle.org',
        user: null
      }
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
    expect(BackgroundGeolocation.start).toHaveBeenCalledTimes(1)
  })

})
