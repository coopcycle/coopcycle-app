import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { Platform } from 'react-native';

import {
  selectIsTasksLoading,
  selectTasksChangedAlertSound,
} from '../Courier/taskSelectors';
import { selectIsDispatchFetching } from '../Dispatch/selectors';
import { EVENT as EVENT_ORDER } from '../../domain/Order';
import { EVENT as EVENT_TASK_COLLECTION } from '../../domain/TaskCollection';
import { selectAutoAcceptOrdersEnabled } from '../Restaurant/selectors';
import { httpClientService } from '../../services/httpClientService';
import AppUser from '../../AppUser';
import { RootState } from '../store';

export const selectHttpClient = () => httpClientService.getClient();

export const selectCustomBuild = state => state.app.customBuild;

// AppUser, for logged in user use selectLoggedInUser
const _selectUser = (state: RootState) => state.app.user;

export const selectUser = createSelector(_selectUser, user =>
  user
    ? new AppUser(
        user.username,
        user.email,
        user.token,
        user.roles,
        user.refreshToken,
        user.enabled,
        user.guest,
      )
    : null,
);

// a user with an account
export const selectIsAuthenticated = createSelector(
  selectUser,
  user => !!(user && user.isAuthenticated()),
);

export const selectLoggedInUser = createSelector(
  selectUser,
  selectIsAuthenticated,
  (user, isAuthenticated) => {
    if (isAuthenticated) {
      return user;
    }

    return null;
  },
);

export const selectIsGuest = createSelector(
  selectUser,
  user => !!(user && user.isGuest()),
);

export const selectResumeCheckoutAfterActivation = state =>
  state.app.resumeCheckoutAfterActivation;
export const selectHttpClientHasCredentials = createSelector(
  selectHttpClient,
  httpClient => !!(httpClient && !!httpClient.getToken()),
);

export const selectIsLoading = createSelector(
  state => state.app.loading,
  selectIsTasksLoading,
  selectIsDispatchFetching,
  state => state.restaurant.isFetching,
  state => state.checkout.isFetching,
  (
    isAppLoading,
    isTasksLoading,
    isDispatchLoading,
    isRestaurantLoading,
    isCheckoutLoading,
  ) => {
    return (
      isAppLoading ||
      isTasksLoading ||
      isDispatchLoading ||
      isRestaurantLoading ||
      isCheckoutLoading ||
      false
    );
  },
);

export const selectIsCentrifugoConnecting = state =>
  state.app.isCentrifugoConnecting;

export const selectIsCentrifugoConnected = state =>
  state.app.isCentrifugoConnected;

export const selectIsCourier = createSelector(
  selectUser,
  user => user && user.hasRole('ROLE_COURIER'),
);

export const selectInitialRouteName = createSelector(
  selectUser,
  state => state.restaurant.myRestaurants,
  (user, restaurants) => {
    if (user && user.isAuthenticated()) {
      if (user.hasRole('ROLE_COURIER')) {
        return 'CourierNav';
      }

      if (user.hasRole('ROLE_DISPATCHER') || user.hasRole('ROLE_ADMIN')) {
        return 'DispatchNav';
      }

      if (user.hasRole('ROLE_RESTAURANT') || user.hasRole('ROLE_STORE')) {
        if (restaurants.length > 0) {
          return 'RestaurantNav';
        }

        return 'StoreNav';
      }
    }

    return 'CheckoutNav';
  },
);

export const selectShowRestaurantsDrawerItem = createSelector(
  selectUser,
  selectIsAuthenticated,
  state => state.restaurant.myRestaurants,
  (user, isAuthenticated, restaurants) =>
    isAuthenticated &&
    (user.hasRole('ROLE_ADMIN') || user.hasRole('ROLE_RESTAURANT')) &&
    restaurants.length > 0,
);

export const selectServersWithURL = createSelector(
  state => state.app.servers,
  servers => {
    const serversWithURL = _.filter(servers, server =>
      server.hasOwnProperty('coopcycle_url'),
    );

    return serversWithURL.sort((a, b) => (a.city < b.city ? -1 : 1));
  },
);

export const selectBaseURL = state => state.app.baseURL;

export const selectServersInSameCity = createSelector(
  selectServersWithURL,
  selectBaseURL,
  (servers, baseURL) => {
    if (!baseURL) {
      return [];
    }

    const currentServer = _.find(
      servers,
      server => server.coopcycle_url === baseURL,
    );

    if (!currentServer) {
      return [];
    }

    const serversInSameCity = _.filter(servers, server => {
      return server.city === currentServer.city;
    });

    // order servers randomly to avoid always same server as the first option
    return _.shuffle(serversInSameCity);
  },
);

export const selectServersWithoutRepeats = createSelector(
  selectServersWithURL,
  servers => {
    return servers.reduce((withoutRepeatsAcc, server) => {
      const serverCityAlreadyExist = withoutRepeatsAcc.some(
        nonRepeatedServer => nonRepeatedServer.city === server.city,
      );
      if (!serverCityAlreadyExist) {
        withoutRepeatsAcc.push(server);
      }
      return withoutRepeatsAcc;
    }, []);
  },
);

export const selectIsBarcodeEnabled = state =>
  state.app.isBarcodeEnabled ?? true;

export const selectCurrentRoute = state => state.app.currentRoute;

export const selectNotifications = state => state.app.notifications;

export const selectNotificationsWithSound = createSelector(
  selectNotifications,
  selectTasksChangedAlertSound,
  selectLoggedInUser,
  (notifications, tasksChangedAlertSound, loggedInUser) =>
    notifications.filter(notification => {
      switch (notification.event) {
        case EVENT_ORDER.CREATED:
          return true;
        case EVENT_TASK_COLLECTION.CHANGED:
          // Skip users with dispatcher/admin roles
          return tasksChangedAlertSound && loggedInUser && !(loggedInUser.hasRole('ROLE_DISPATCHER') || loggedInUser.hasRole('ROLE_ADMIN'));
        default:
          return false;
      }
    }),
);

export const selectNotificationsToDisplay = createSelector(
  selectNotifications,
  selectAutoAcceptOrdersEnabled,
  selectLoggedInUser,
  (notifications, autoAcceptOrdersEnabled, loggedInUser) =>
    notifications.filter(notification => {
      switch (notification.event) {
        case EVENT_ORDER.CREATED:
          return !autoAcceptOrdersEnabled;
        case EVENT_TASK_COLLECTION.CHANGED:
          // Skip users with dispatcher/admin roles
          return loggedInUser && !(loggedInUser.hasRole('ROLE_DISPATCHER') || loggedInUser.hasRole('ROLE_ADMIN'));
        default:
          return true;
      }
    }),
);

export const selectSettingsLatLng = state => state.app.settings.latlng;
export const selectStripePublishableKey = state =>
  state.app.settings.stripe_publishable_key;
export const selectShouldNotificationBeDisplayed = state =>
  state.app.shouldNotificationBeDisplayed;

const _selectCountry = state => state.app.settings.country;

export const selectCountry = createSelector(
  _selectCountry,
  country => country.toUpperCase(),
);
