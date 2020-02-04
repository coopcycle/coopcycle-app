import { createSelector } from 'reselect'

export const selectUser = state => state.app.user
export const selectHttpClient = state => state.app.httpClient

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => !!(user && user.isAuthenticated())
)

export const selectHttpClientHasCredentials = createSelector(
  selectHttpClient,
  (httpClient) => !!(httpClient && !!httpClient.getToken())
)
