import { createSelector } from 'reselect'

export const selectUser = state => state.app.user

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => !!(user && user.isAuthenticated())
)
