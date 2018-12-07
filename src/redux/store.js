import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducers from './reducers'
import PreferencesMiddleware from './middlewares/PreferencesMiddleware'
import WsMiddleware from './middlewares/WebSocketMiddleware'

const middlewares = [ thunk, PreferencesMiddleware, WsMiddleware() ]


if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');

  middlewares.push(logger);
}

export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middlewares))
)


export const observeStore = (store, selector, onChange) => {
  let currentState = null

  const handleChange = () => {
    const nextState = selector(store.getState())

    if (nextState !== currentState) {
      currentState = nextState
      onChange(currentState)
    }
  }

  const unsubscribe = store.subscribe(handleChange)
  handleChange()
  return unsubscribe
}
