/**
 * App Redux Fragment
 *
 * Exports action types, action creators, reducers and selectors related to the
 * non-domain specific aspects of the application
 */
import appReducer from './reducers'
import { selectIsWsOpen } from './selectors'

export {
  appReducer,
  selectIsWsOpen,
}
