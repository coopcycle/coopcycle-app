import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

const middlewares = [ thunk ]


if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');

  middlewares.push(logger);
}

let store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middlewares))
)

export default store
