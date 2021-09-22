import * as Sentry from '@sentry/react-native'

export default ({ getState, dispatch }) => {

  return (next) => (action) => {

    const prevState = getState()
    const result = next(action)
    const state = getState()

    if (state.app.baseURL !== prevState.app.baseURL) {
        Sentry.setTag('coopcycle_url', state.app.baseURL ?? 'none')
    }

    return result
  }
}
