/*
 * UI-related state for the shift-planning feature (not persisted shift
 * entities themselves, those come from the API — see redux/api/slice.ts)
 */
import {
  SET_SHIFT_REMINDERS_ENABLED,
  SET_SHIFT_SELECTED_WEEK,
} from './actions';
import { DateOnlyString } from '../../utils/date-types';

type ShiftUiState = {
  remindersEnabled: boolean;
  // Shared by My Shifts / Open Shifts / Holidays so switching between them
  // keeps the same week. Not persisted (see `shiftUiPersistConfig`): a fresh
  // launch should open on the current week, not on whatever was last browsed.
  //
  // `null` means "whatever the current week is", resolved when read — see
  // `selectShiftSelectedWeek`. Storing the resolved Monday here instead would
  // freeze it at store-creation time, so an app left open past Sunday midnight
  // would keep showing the week that just ended.
  selectedWeek: DateOnlyString | null;
};

const shiftUiInitialState: ShiftUiState = {
  remindersEnabled: true,
  selectedWeek: null,
};

export const shiftUiReducer = (
  state = shiftUiInitialState,
  action = {},
) => {
  switch (action.type) {
    case SET_SHIFT_REMINDERS_ENABLED:
      return {
        ...state,
        remindersEnabled: action.payload,
      };

    case SET_SHIFT_SELECTED_WEEK:
      return {
        ...state,
        selectedWeek: action.payload,
      };
  }

  return state;
};
