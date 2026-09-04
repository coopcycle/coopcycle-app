import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { moment } from '@/src/shared';
import i18n from '../../i18n';
import NavigationHolder from '../../NavigationHolder';
import { Shift, ShiftActivity } from '../../redux/api/types';
import { getActivityLabel } from './utils';

export const REMINDER_ID_PREFIX = 'shift-reminder-';
export const REMINDER_MINUTES_BEFORE = 15;
// Bounds how far ahead we schedule: iOS caps an app at 64 pending local
// notifications total, so we only ever schedule for the near future — shifts
// further out get picked up on a later sync, once they fall inside the
// window (every time `MyShifts` is (re)fetched, see useShiftReminderSync).
export const REMINDER_WINDOW_DAYS = 7;

const ANDROID_CHANNEL_ID = 'shift-reminders';

type ShiftReminderRequest = {
  identifier: string;
  content: {
    title: string;
    body: string;
    data: { shiftId: number };
  };
  trigger: Notifications.DateTriggerInput;
};

/**
 * Pure function: given the courier's shifts and the activity catalog (for
 * labels), computes the set of local notifications that should be scheduled
 * right now. Kept side-effect free so it can be unit tested without mocking
 * expo-notifications.
 */
export function computeShiftReminderRequests(
  shifts: Shift[],
  activities: ShiftActivity[],
  now: moment.Moment = moment(),
): ShiftReminderRequest[] {
  const windowEnd = moment(now).add(REMINDER_WINDOW_DAYS, 'days');

  return shifts
    .map((shift): ShiftReminderRequest | null => {
      const startsAt = moment(shift.startsAt);
      const triggerAt = moment(startsAt).subtract(
        REMINDER_MINUTES_BEFORE,
        'minutes',
      );

      if (triggerAt.isSameOrBefore(now) || startsAt.isAfter(windowEnd)) {
        return null;
      }

      return {
        identifier: `${REMINDER_ID_PREFIX}${shift.id}`,
        content: {
          title: `${i18n.t('SHIFT_REMINDER_TITLE')}`,
          body: `${i18n.t('SHIFT_REMINDER_BODY', {
            activity: getActivityLabel(activities, shift.activity),
            minutes: REMINDER_MINUTES_BEFORE,
          })}`,
          data: { shiftId: shift.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerAt.toDate(),
        },
      };
    })
    .filter((request): request is ShiftReminderRequest => request !== null);
}

/**
 * Cancels every previously-scheduled shift reminder and reschedules a fresh
 * set from the current shift list. Simpler and safer than diffing at this
 * scale (a courier has at most a handful of shifts in the reminder window).
 */
export async function syncShiftReminders(
  shifts: Shift[],
  activities: ShiftActivity[],
): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: i18n.t('SHIFT_REMINDER_TITLE'),
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter(notification =>
        notification.identifier?.startsWith(REMINDER_ID_PREFIX),
      )
      .map(notification =>
        Notifications.cancelScheduledNotificationAsync(
          notification.identifier,
        ),
      ),
  );

  const requests = computeShiftReminderRequests(shifts, activities);

  await Promise.all(
    requests.map(request => Notifications.scheduleNotificationAsync(request)),
  );
}

let tapListenerRegistered = false;

/**
 * Local notifications don't flow through the app's remote-push handling
 * (PushNotificationMiddleware) — on Android in particular, remote push goes
 * through @react-native-firebase/messaging, a different native pipeline than
 * expo-notifications (used here for local scheduling). So reminder taps get
 * their own small, dedicated listener instead.
 */
export function registerShiftReminderTapListener(): void {
  if (tapListenerRegistered) {
    return;
  }
  tapListenerRegistered = true;

  Notifications.addNotificationResponseReceivedListener(response => {
    const identifier = response.notification.request.identifier;
    if (identifier?.startsWith(REMINDER_ID_PREFIX)) {
      NavigationHolder.navigate('ShiftNav', { screen: 'MyShifts' });
    }
  });
}
