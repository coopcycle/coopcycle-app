import { useEffect } from 'react';
import PushNotification from '../notifications';
import tracker from '../analytics/Tracker';
import analyticsEvent from '../analytics/Event';
import { useDispatch, useSelector } from 'react-redux';
import {
  pushNotification,
  registerPushNotificationToken,
} from '../redux/App/actions';
import { loadOrder, loadOrderAndNavigate } from '../redux/Restaurant/actions';
import NavigationHolder from '../NavigationHolder';
import moment from 'moment/moment';
import { loadTasks } from '../redux/Courier';
import { message as wsMessage } from '../redux/middlewares/CentrifugoMiddleware/actions';
import { selectCurrentRoute } from '../redux/App/selectors';

function useOnRegister() {
  const dispatch = useDispatch();

  return token => {
    dispatch(registerPushNotificationToken(token));
  };
}

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
    const { event } = message.data;

    if (event && event.name === 'order:created') {
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

    if (event && event.name === 'tasks:changed') {
      tracker.logEvent(
        analyticsEvent.courier._category,
        analyticsEvent.courier.tasksChangedMessage,
        message.foreground ? 'in_app' : 'notification_center',
      );

      if (message.foreground) {
        dispatch(
          pushNotification('tasks:changed', {
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

function useOnBackgroundMessage() {
  const dispatch = useDispatch();

  return message => {
    const { event } = message.data;
    if (event && event.name === 'order:created') {
      dispatch(
        loadOrder(event.data.order, order => {
          if (order) {
            // Simulate a WebSocket message
            dispatch(
              wsMessage({
                name: 'order:created',
                data: { order },
              }),
            );
          }
        }),
      );
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
