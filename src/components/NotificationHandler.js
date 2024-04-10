import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearNotifications } from '../redux/App/actions';
import NotificationModal from './NotificationModal';
import usePushNotification from '../hooks/usePushNotification';
import usePlayNotificationSound from '../hooks/usePlayNotificationSound';
import { selectNotifications } from '../redux/App/selectors';
import { EVENT as EVENT_ORDER } from '../domain/Order';
import { EVENT as EVENT_TASK_COLLECTION } from '../domain/TaskCollection';
import { selectTasksChangedAlertSound } from '../redux/Courier';
import { selectRestaurant } from '../redux/Restaurant/selectors';

/**
 * This component is used
 * 1/ To configure push notifications (see usePushNotification)
 * 2/ To show notifications when the app is in foreground (see NotificationModal)
 * 3/ To play a sound when a notification is received (see usePlayNotificationSound)
 */
export default function NotificationHandler() {
  usePushNotification();

  const allNotifications = useSelector(selectNotifications);

  const tasksChangedAlertSound = useSelector(selectTasksChangedAlertSound);

  const notificationsWithSound = allNotifications.filter(notification => {
    switch (notification.event) {
      case EVENT_ORDER.CREATED:
        return true;
      case EVENT_TASK_COLLECTION.CHANGED:
        return tasksChangedAlertSound;
      default:
        return false;
    }
  });

  const restaurant = useSelector(selectRestaurant);

  const notificationsToDisplay = allNotifications.filter(notification => {
    switch (notification.event) {
      case EVENT_ORDER.CREATED:
        if (restaurant && restaurant.autoAcceptOrdersEnabled) {
          return false;
        } else {
          return true;
        }
      case EVENT_TASK_COLLECTION.CHANGED:
        return true;
      default:
        return true;
    }
  });

  const { isSoundPlaying, stopSound } = usePlayNotificationSound(
    notificationsWithSound,
  );

  const dispatch = useDispatch();

  const clear = useCallback(() => {
    stopSound();
    dispatch(clearNotifications());
  }, [stopSound, dispatch]);

  useEffect(() => {
    if (isSoundPlaying) {
      // Clear notifications after 10 seconds
      setTimeout(() => {
        clear();
      }, 10000);
    }
  }, [isSoundPlaying, clear]);

  return (
    <NotificationModal
      notifications={notificationsToDisplay}
      onDismiss={() => {
        clear();
      }}
    />
  );
}
