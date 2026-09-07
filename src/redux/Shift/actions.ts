import { createAction } from 'redux-actions';

export const SET_SHIFT_REMINDERS_ENABLED = 'SET_SHIFT_REMINDERS_ENABLED';
export const SET_SHIFT_SELECTED_WEEK = 'SET_SHIFT_SELECTED_WEEK';

export const setShiftRemindersEnabled = createAction(
  SET_SHIFT_REMINDERS_ENABLED,
);

// The Monday of the week the shift screens are showing, as 'YYYY-MM-DD'.
export const setShiftSelectedWeek = createAction(SET_SHIFT_SELECTED_WEEK);
