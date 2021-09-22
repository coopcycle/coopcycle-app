import { createSelector } from 'reselect'

import { selectIsTasksLoading } from '../Courier/taskSelectors'
import { selectIsDispatchFetching } from '../Dispatch/selectors'

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

export const selectIsLoading = createSelector(
  state => state.app.loading,
  selectIsTasksLoading,
  selectIsDispatchFetching,
  state => state.restaurant.isFetching,
  state => state.checkout.isFetching,
  (isAppLoading, isTasksLoading, isDispatchLoading, isRestaurantLoading, isCheckoutLoading) => {

    return isAppLoading
      || isTasksLoading
      || isDispatchLoading
      || isRestaurantLoading
      || isCheckoutLoading
      || false
  }
)

export const selectIsCentrifugoConnected = state => state.app.isCentrifugoConnected

export const selectInitialRouteName = createSelector(
  selectUser,
  state => state.restaurant.myRestaurants,
  (user, restaurants) => {

    if (user && user.isAuthenticated()) {

      if (user.hasRole('ROLE_COURIER')) {
        return 'CourierNav'
      }

      if (user.hasRole('ROLE_ADMIN')) {
        return 'DispatchNav'
      }

      if (user.hasRole('ROLE_RESTAURANT') || user.hasRole('ROLE_STORE')) {

        if (restaurants.length > 0) {
          return 'RestaurantNav'
        }

        return 'StoreNav'
      }
    }

    return 'CheckoutNav'
  }
)

export const selectShowRestaurantsDrawerItem = createSelector(
  selectUser,
  selectIsAuthenticated,
  state => state.restaurant.myRestaurants,
  (user, isAuthenticated, restaurants) =>
    isAuthenticated && (user.hasRole('ROLE_ADMIN') || user.hasRole('ROLE_RESTAURANT')) && restaurants.length > 0
)
