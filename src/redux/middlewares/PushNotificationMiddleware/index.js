import { Platform } from 'react-native';
import {
  LOGOUT_REQUEST,
  deletePushNotificationTokenSuccess,
  foregroundPushNotification,
  registerPushNotificationToken,
  savePushNotificationTokenSuccess,
} from '../../App/actions';
import {
  selectHttpClient,
  selectHttpClientHasCredentials,
  selectIsAuthenticated,
} from '../../App/selectors';
import PushNotification from '../../../notifications';
import { EVENT as EVENT_ORDER } from '../../../domain/Order';
import tracker from '../../../analytics/Tracker';
import analyticsEvent from '../../../analytics/Event';
import { loadOrder, loadOrderAndNavigate } from '../../Restaurant/actions';
import { EVENT as EVENT_TASK_COLLECTION } from '../../../domain/TaskCollection';
import { navigateAndLoadTasks } from '../../Courier/taskActions';
import moment from 'moment';

let isFetching = false;

// As remote push notifications are configured very early,
// most of the time the user won't be authenticated
// (for example, when app is launched for the first time)
// We store the token for later, when the user authenticates
export default ({ getState, dispatch }) => {
  const onRegister = token => {
    console.log('onRegister token:', token);
    dispatch(registerPushNotificationToken(token));
  };

  /**
   * called when a user taps on a notification in the notification center
   * android: notification is only shown when the app is in the background
   * ios: notification is shown both in the foreground and background
   */
  const onNotification = message => {
    console.log('onNotification message:', message);

    const { event } = message.data;

    if (event && event.name === EVENT_ORDER.CREATED) {
      tracker.logEvent(
        analyticsEvent.restaurant._category,
        analyticsEvent.restaurant.orderCreatedMessage,
        message.foreground ? 'in_app' : 'notification_center',
      );

      const { order } = event.data;

      // Here in any case, we navigate to the order that was tapped,
      // it should have been loaded via WebSocket already.
      dispatch(loadOrderAndNavigate(order));
    }

    if (event && event.name === EVENT_TASK_COLLECTION.CHANGED) {
      tracker.logEvent(
        analyticsEvent.courier._category,
        analyticsEvent.courier.tasksChangedMessage,
        message.foreground ? 'in_app' : 'notification_center',
      );

      if (message.foreground) {
        dispatch(
          foregroundPushNotification(event.name, {
            date: event.data.date,
          }),
        );
      } else {
        dispatch(navigateAndLoadTasks(moment(event.data.date)));
      }
    }
  };

  /**
   * called when a push notification is received while the app is in the foreground
   * android only!
   */
  const onBackgroundMessage = message => {
    console.log('onBackgroundMessage message:', message.data);

    const { event } = message.data;

    if (event) {
      switch (event.name) {
        case EVENT_ORDER.CREATED:
          dispatch(
            loadOrder(event.data.order, order => {
              if (order) {
                dispatch(
                  foregroundPushNotification(event.name, {
                    order: order,
                  }),
                );
              }
            }),
          );
          break;
        case EVENT_TASK_COLLECTION.CHANGED:
          dispatch(
            foregroundPushNotification(event.name, {
              date: event.data.date,
            }),
          );
          break;
        default:
          break;
      }
    }
  };

  PushNotification.configure({
    onRegister: token => onRegister(token),
    onNotification: message => onNotification(message),
    onBackgroundMessage: message => onBackgroundMessage(message),
  });

  return next => action => {
    const result = next(action);
    const state = getState();

    if (!state.app.pushNotificationToken) {
      return result;
    }

    if (action.type === LOGOUT_REQUEST) {
      const httpClient = selectHttpClient(state);

      httpClient
        .delete(`/api/me/remote_push_tokens/${state.app.pushNotificationToken}`)
        // We don't care about 404s or what
        .finally(() => dispatch(deletePushNotificationTokenSuccess()));

      return result;
    }

    if (state.app.pushNotificationTokenSaved) {
      return result;
    }

    if (selectIsAuthenticated(state) && selectHttpClientHasCredentials(state)) {
      if (isFetching) {
        return result;
      }

      isFetching = true;

      const httpClient = selectHttpClient(state);

      httpClient
        .post('/api/me/remote_push_tokens', {
          platform: Platform.OS,
          token: state.app.pushNotificationToken,
        })
        .then(() => dispatch(savePushNotificationTokenSuccess()))
        .catch(e => console.log(e))
        .finally(() => {
          isFetching = false;
        });
    }

    return result;
  };
};
