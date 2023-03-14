import { LOAD_RESTAURANTS_SUCCESS } from './actions';
import jwtDecode from 'jwt-decode';
import _ from 'lodash';

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
