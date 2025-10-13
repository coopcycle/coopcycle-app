import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearNotifications,
  startSound,
  stopSound,
} from '../redux/App/actions';
import NotificationModal from './NotificationModal';
import {
  selectNotificationsToDisplay,
  selectNotificationsWithSound,
  selectShouldNotificationBeDisplayed,
} from '../redux/App/selectors';
import { AppState } from 'react-native';

const NOTIFICATION_DURATION_MS = 10000;

/**
 * This component is used
 * 1/ To show notifications when the app is in the foreground (using NotificationModal)
 * 2/ To play a sound when a notification is received (via SoundMiddleware)
 *
 * Push notifications are configured and received in PushNotificationMiddleware
 */
export default function NotificationHandler() {
  const notificationsToDisplay = useSelector(selectNotificationsToDisplay);
  const notificationsWithSound = useSelector(selectNotificationsWithSound);
  const shouldNotificationBeDisplayed = useSelector(
    selectShouldNotificationBeDisplayed,
  );

  const hasNotifications = useMemo(
    () =>
      notificationsToDisplay.length > 0 || notificationsWithSound.length > 0,
    [notificationsToDisplay, notificationsWithSound],
  );

  const hasNotificationsWithSound = useMemo(
    () => notificationsWithSound.length > 0,
    [notificationsWithSound],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // use memoized value to avoid re-setting timeout when more notifications arrive
    if (hasNotifications) {
      setTimeout(() => {
        dispatch(clearNotifications());
      }, NOTIFICATION_DURATION_MS);
    }
  }, [hasNotifications, dispatch]);

  useEffect(() => {
    // on Android, when notification is received, OS let us execute some code
    // but it's very limited, e.g. handlers set via setTimeout are not executed
    // so we do not play sound in that case, because we will not be able to stop it
    // use memoized value to avoid re-starting the sound when more notifications arrive
    if (
      shouldNotificationBeDisplayed &&
      hasNotificationsWithSound &&
      AppState.currentState === 'active'
    ) {
      dispatch(startSound());
    } else {
      dispatch(stopSound());
    }
  }, [shouldNotificationBeDisplayed, hasNotificationsWithSound, dispatch]);

  if (!shouldNotificationBeDisplayed) {
    return null;
  }

  return (
    <NotificationModal
      notifications={notificationsToDisplay}
      onDismiss={() => {
        dispatch(clearNotifications());
      }}
    />
  );
}
