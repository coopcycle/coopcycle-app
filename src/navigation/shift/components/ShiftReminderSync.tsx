import { useEffect } from 'react';
import { useShiftReminderSync } from '../hooks/useShiftReminderSync';
import { registerShiftReminderTapListener } from '../reminders';

/**
 * Renders nothing — mounted once (in DrawerNavigator, gated on
 * showShiftsDrawerItem) purely to keep local shift reminders in sync for as
 * long as the app is running, regardless of which screen is focused.
 */
export default function ShiftReminderSync() {
  useShiftReminderSync();

  useEffect(() => {
    registerShiftReminderTapListener();
  }, []);

  return null;
}
