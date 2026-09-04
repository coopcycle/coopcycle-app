import { useEffect } from 'react';
import {
  useGetMyShiftsQuery,
  useGetShiftActivitiesQuery,
} from '../../../redux/api/slice';
import { getShiftsDateRange } from '../utils';
import { syncShiftReminders } from '../reminders';

/**
 * Keeps locally-scheduled "shift starting soon" reminders in sync with the
 * courier's current shifts. Re-runs whenever `MyShifts` is (re)fetched —
 * including after applying/withdrawing from a shift, or after receiving a
 * "schedule published" push (see PushNotificationMiddleware), which
 * invalidates the same RTK Query cache tag.
 */
export function useShiftReminderSync(): void {
  const range = getShiftsDateRange();
  const { data: shifts } = useGetMyShiftsQuery(range);
  const { data: activities } = useGetShiftActivitiesQuery();

  useEffect(() => {
    if (shifts && activities) {
      syncShiftReminders(shifts, activities);
    }
  }, [shifts, activities]);
}
