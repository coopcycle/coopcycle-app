/**
 * App Redux Fragment
 *
 * Exports action types, action creators, reducers and selectors related to the
 * non-domain specific aspects of the application
 */
import appReducer from './reducers'

/*
 * Selectors
 *
 * Selectors help decouple the shape of the state from the component code itself.
 */
const selectIsWsOpen = state => state.app.isWsOpen

export {
  appReducer,
  selectIsWsOpen,
}
