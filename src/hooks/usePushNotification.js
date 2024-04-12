import { useEffect } from 'react';
import PushNotification from '../notifications';
import tracker from '../analytics/Tracker';
import analyticsEvent from '../analytics/Event';
import { useDispatch, useSelector } from 'react-redux';
import {
  foregroundPushNotification,
  registerPushNotificationToken,
} from '../redux/App/actions'
import { loadOrder, loadOrderAndNavigate } from '../redux/Restaurant/actions';
import NavigationHolder from '../NavigationHolder';
import moment from 'moment/moment';
import { loadTasks } from '../redux/Courier';
import { selectCurrentRoute } from '../redux/App/selectors';
import { EVENT as EVENT_ORDER } from '../domain/Order';
import { EVENT as EVENT_TASK_COLLECTION } from '../domain/TaskCollection';

function useOnRegister() {
  const dispatch = useDispatch();

  return token => {
    console.log('useOnRegister token:', token);
    dispatch(registerPushNotificationToken(token));
  };
}

/**
 * called when a user taps on a notification in the notification center
 * android: only called when the app is in the background
 * ios: called when the app is in the foreground or background (?)
 */
function useOnNotification() {
  const currentRoute = useSelector(selectCurrentRoute);
  const dispatch = useDispatch();

  const _onTasksChanged = date => {
    if (currentRoute !== 'CourierTaskList') {
      NavigationHolder.navigate('CourierTaskList', {});
    }

    dispatch(loadTasks(moment(date)));
  };

  return message => {
    console.log('useOnNotification message:', message);

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
        // user clicked on a notification in the notification center
        _onTasksChanged(event.data.date);
      }
    }
  };
}

/**
 * called when a push notification is received while the app is in the foreground
 * android only!
 */
function useOnBackgroundMessage() {
  const dispatch = useDispatch();

  return message => {
    console.log('useOnBackgroundMessage message:', message.data);

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
}

export default function usePushNotification() {
  const onRegister = useOnRegister();
  const onNotification = useOnNotification();
  const onBackgroundMessage = useOnBackgroundMessage();

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
