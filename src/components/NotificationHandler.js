import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearNotifications } from '../redux/App/actions';
import NotificationModal from './NotificationModal';
import usePlayNotificationSound from '../hooks/usePlayNotificationSound';
import { selectNotifications } from '../redux/App/selectors';
import { EVENT as EVENT_ORDER } from '../domain/Order';
import { EVENT as EVENT_TASK_COLLECTION } from '../domain/TaskCollection';
import { selectTasksChangedAlertSound } from '../redux/Courier';
import { selectAutoAcceptOrdersEnabled } from '../redux/Restaurant/selectors';

/**
 * This component is used
 * 1/ To show notifications when the app is in foreground (see NotificationModal)
 * 2/ To play a sound when a notification is received (see usePlayNotificationSound)
 */
export default function NotificationHandler() {
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

  const autoAcceptOrdersEnabled = useSelector(selectAutoAcceptOrdersEnabled);

  const notificationsToDisplay = allNotifications.filter(notification => {
    switch (notification.event) {
      case EVENT_ORDER.CREATED:
        return !autoAcceptOrdersEnabled;
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
