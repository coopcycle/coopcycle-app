import jwtDecode from 'jwt-decode';
import _ from 'lodash';
import {LOAD_RESTAURANTS_SUCCESS} from './actions';
import SearchEngine from '../../utils/searchEngine';

export const filterExpiredCarts = () => {
  return (next) => (action) => {

    if (action.type !== 'persist/REHYDRATE' || action.key !== 'checkout')
      {return next(action)}

    if (_.has(action.payload, 'carts')) {
      action.payload.carts = _.reduce(action.payload.carts, (acc, value, key) => {
        if (jwtDecode(value.token).exp + 3600 < Date.now() / 1000) {
          console.log(`Remove expired cart: ${key}`)
          return acc
        }
        acc[key] = value
        return acc
      }, {})
    }

    return next(action)
  }
}

export const restaurantsSearchIndex = () => {
  return (next) => (action) => {

    if (action.type !== LOAD_RESTAURANTS_SUCCESS) {
      return next(action)
    }

    SearchEngine.setRestaurants(action.payload)

    return next(action)
  }
}
