import { createAction } from 'redux-actions';

export const SET_SHIFT_REMINDERS_ENABLED = 'SET_SHIFT_REMINDERS_ENABLED';

export const setShiftRemindersEnabled = createAction(
  SET_SHIFT_REMINDERS_ENABLED,
);
