import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearNotifications } from '../redux/App/actions';
import NotificationModal from './NotificationModal';
import usePushNotification from '../hooks/usePushNotification';
import usePlayNotificationSound from '../hooks/usePlayNotificationSound';
import { selectNotifications } from '../redux/App/selectors';

/**
 * This component is used
 * 1/ To configure push notifications (see usePushNotification)
 * 2/ To show notifications when the app is in foreground (see NotificationModal)
 * 3/ To play a sound when a notification is received (see usePlayNotificationSound)
 */
export default function NotificationHandler() {
  usePushNotification();

  const notifications = useSelector(selectNotifications);

  const { isSoundPlaying, stopSound } = usePlayNotificationSound(notifications);

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
      notifications={notifications}
      onDismiss={() => {
        clear();
      }}
    />
  );
}
