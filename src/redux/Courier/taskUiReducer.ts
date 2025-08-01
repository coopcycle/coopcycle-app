/*
 * Task related reducers
 */
import moment from 'moment';
import {
  ADD_TASK_FILTER,
  CHANGE_DATE,
  CLEAR_TASK_FILTER,
  LOAD_TASKS_REQUEST,
  SET_HIDE_UNASSIGNED_FROM_MAP,
  SET_KEEP_AWAKE,
  SET_POLYLINE_ON,
  SET_SIGNATURE_SCREEN_FIRST,
  SET_TASKS_CHANGED_ALERT_SOUND,
  SET_TASK_FILTER,
} from './taskActions';

/*
 * Intital state shape for the task UI reducer
 * Data related to the presentation of task-related components
 * but not directly related to the entity itself goes here
 */
const tasksUiInitialState = {
  selectedDate: moment(), // Date selected by the user
  excludeFilters: [], // Key-value pairs of active filters (e.g. status: 'done')
  tasksChangedAlertSound: true,
  keepAwake: false,
  isHideUnassignedFromMap: false,
  isPolylineOn: true,
  signatureScreenFirst: false,
};

export const tasksUiReducer = (state = tasksUiInitialState, action = {}) => {
  switch (action.type) {
    case LOAD_TASKS_REQUEST:
      return {
        ...state,
        selectedDate: action.payload.date || moment(),
      };

    case ADD_TASK_FILTER:
    case SET_TASK_FILTER:
      return {
        ...state,
        excludeFilters: state.excludeFilters.concat(action.payload),
      };

    case SET_TASKS_CHANGED_ALERT_SOUND:
      return {
        ...state,
        tasksChangedAlertSound: action.payload,
      };

    case SET_KEEP_AWAKE:
      return {
        ...state,
        keepAwake: action.payload,
      };

    case SET_HIDE_UNASSIGNED_FROM_MAP:
      return {
        ...state,
        isHideUnassignedFromMap: action.payload,
      };

    case SET_POLYLINE_ON:
      return {
        ...state,
        isPolylineOn: action.payload,
      };

    case CLEAR_TASK_FILTER:
      // Empty payload clears all exclusion rules
      if (!action.payload) {
        return {
          ...state,
          excludeFilters: [],
        };
      }

      // Filters with any matches to exclusion rules are removed from the payload
      return {
        ...state,
        excludeFilters: state.excludeFilters.filter(filter =>
          Object.keys(action.payload).some(
            k => action.payload[k] !== filter[k],
          ),
        ),
      };

    case SET_SIGNATURE_SCREEN_FIRST:
      return {
        ...state,
        signatureScreenFirst: action.payload,
      };

    case CHANGE_DATE:
      return {
        ...state,
        selectedDate: action.payload,
      };
  }

  return state;
};
