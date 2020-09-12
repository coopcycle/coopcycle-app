import { AppState } from 'react-native'
import _ from 'lodash'

import { pushNotification } from '../App/actions'
import { MESSAGE } from '../middlewares/WebSocketMiddleware/actions'

export const ringOnNewOrderCreated = ({ getState, dispatch }) => {

  return (next) => (action) => {

    if (AppState.currentState !== 'active') {
      return next(action)
    }

    if (action.type !== MESSAGE) {
      return next(action)
    }

    const prevState = getState()
    const result = next(action)
    const state = getState()

    if (state.restaurant.orders.length > 0) {
      if (state.restaurant.orders.length !== prevState.restaurant.orders.length) {
        const orders =
          _.differenceWith(state.restaurant.orders, prevState.restaurant.orders, (a, b) => (a['@id']+':'+a.state) === (b['@id']+':'+b.state))
        orders.forEach(o => {
          if (o.state === 'new') {
            dispatch(pushNotification('order:created', { order: o }))
          }
        })
      }
    }

    return result
  }
}
