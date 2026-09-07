import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetMyShiftsQuery,
  useGetShiftActivitiesQuery,
} from '../../../redux/api/slice';
import { selectShiftRemindersEnabled } from '../../../redux/Shift/selectors';
import { getReminderShiftsRange } from '../utils';
import { syncShiftReminders } from '../reminders';

/**
 * Keeps locally-scheduled "shift starting soon" reminders in sync with the
 * courier's current shifts.
 *
 * Uses its own forward-looking range, *not* the week the shift screens are
 * showing: browsing to a past week must not drop reminders for upcoming
 * shifts. That means a separate RTK Query cache entry from the screens', which
 * is intended. Re-runs whenever `MyShifts` is (re)fetched —
 * including after applying/withdrawing from a shift, or after receiving a
 * "schedule published" push (see PushNotificationMiddleware), which
 * invalidates the same RTK Query cache tag — and whenever the courier
 * toggles reminders on/off in Shift Settings.
 */
export function useShiftReminderSync(): void {
  const range = getReminderShiftsRange();
  const { data: shifts } = useGetMyShiftsQuery(range);
  const { data: activities } = useGetShiftActivitiesQuery();
  const remindersEnabled = useSelector(selectShiftRemindersEnabled);

  useEffect(() => {
    if (shifts && activities) {
      syncShiftReminders(shifts, activities, remindersEnabled);
    }
  }, [shifts, activities, remindersEnabled]);
}
