import _ from 'lodash'
import { createSelector } from 'reselect'

import { selectIsTasksLoading } from '../Courier/taskSelectors'
import { selectIsDispatchFetching } from '../Dispatch/selectors'

export const selectUser = state => state.app.user
export const selectHttpClient = state => state.app.httpClient

export const selectResumeCheckoutAfterActivation = state => state.app.resumeCheckoutAfterActivation

// a user with an account
export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => !!(user && user.isAuthenticated())
)

export const selectIsGuest = createSelector(
  selectUser,
  (user) => !!(user && user.isGuest())
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

export const selectServersWithURL = createSelector(
  state => state.app.servers,
  (servers) => {
    const serversWithURL = _.filter(servers, server => server.hasOwnProperty('coopcycle_url'))

    return serversWithURL.sort((a, b) => a.city < b.city ? -1 : 1)
  }
)

export const selectServersInSameCity = createSelector(
  selectServersWithURL,
  state => state.app.baseURL,
  (servers, baseURL) => {
    if (!baseURL) {
      return []
    }

    const currentServer = _.find(servers, (server) => server.coopcycle_url === baseURL)

    if (!currentServer) {
      return []
    }

    const serversInSameCity = _.filter(servers, (server) => {
      return server.city === currentServer.city
    })

    // order servers randomly to avoid always same server as the first option
    return _.shuffle(serversInSameCity)
  }
)

export const selectServersWithoutRepeats = createSelector(
  selectServersWithURL,
  (servers) => {
    return servers.reduce((withoutRepeatsAcc, server) => {
        const serverCityAlreadyExist = withoutRepeatsAcc.some((nonRepeatedServer) => nonRepeatedServer.city === server.city)
        if (!serverCityAlreadyExist) {
            withoutRepeatsAcc.push(server)
        }
        return withoutRepeatsAcc;
    }, [])
  }
)
