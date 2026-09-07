import { getWeekStart } from '../../navigation/shift/utils';

export const selectShiftRemindersEnabled = state =>
  state.ui.shift.remindersEnabled;

// Resolves the "follow the current week" default (null) on every read, so the
// week does not go stale in a long-running app.
export const selectShiftSelectedWeek = state =>
  state.ui.shift.selectedWeek ?? getWeekStart();
