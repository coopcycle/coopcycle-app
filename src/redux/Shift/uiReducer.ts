/*
 * UI-related state for the shift-planning feature (not persisted shift
 * entities themselves, those come from the API — see redux/api/slice.ts)
 */
import { SET_SHIFT_REMINDERS_ENABLED } from './actions';

type ShiftUiState = {
  remindersEnabled: boolean;
};

const shiftUiInitialState: ShiftUiState = {
  remindersEnabled: true,
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
  }

  return state;
};
