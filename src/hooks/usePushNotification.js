import { useCallback, useEffect } from 'react';
import PushNotification from '../notifications';
import tracker from '../analytics/Tracker';
import analyticsEvent from '../analytics/Event';
import { useDispatch } from 'react-redux';
import {
  foregroundPushNotification,
  registerPushNotificationToken,
} from '../redux/App/actions';
import { loadOrder, loadOrderAndNavigate } from '../redux/Restaurant/actions';
import moment from 'moment/moment';
import { EVENT as EVENT_ORDER } from '../domain/Order';
import { EVENT as EVENT_TASK_COLLECTION } from '../domain/TaskCollection';
import { navigateAndLoadTasks } from '../redux/Courier/taskActions';

export default function usePushNotification() {
  const dispatch = useDispatch();

  const onRegister = useCallback(
    token => {
      console.log('onRegister token:', token);
      dispatch(registerPushNotificationToken(token));
    },
    [dispatch],
  );

  /**
   * called when a user taps on a notification in the notification center
   * android: notification is only shown when the app is in the background
   * ios: notification is shown both in the foreground and background
   */
  const onNotification = useCallback(
    message => {
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
    },
    [dispatch],
  );

  /**
   * called when a push notification is received while the app is in the foreground
   * android only!
   */
  const onBackgroundMessage = useCallback(
    message => {
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
    },
    [dispatch],
  );

  useEffect(() => {
    PushNotification.configure({
      onRegister: token => onRegister(token),
      onNotification: message => onNotification(message),
      onBackgroundMessage: message => onBackgroundMessage(message),
    });

    return () => {
      PushNotification.removeListeners();
    };
  }, [onBackgroundMessage, onNotification, onRegister]);
}
