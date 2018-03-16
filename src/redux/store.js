import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducers from './reducers'
import WsMiddleware from './middlewares/WebSocketMiddleware'

const middlewares = [ thunk, WsMiddleware() ]


if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');

  middlewares.push(logger);
}

export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middlewares))
)
