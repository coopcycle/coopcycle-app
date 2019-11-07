/*
 * Task related reducers
 */
import moment from 'moment'
import { LOAD_TASKS_REQUEST, ADD_TASK_FILTER, CLEAR_TASK_FILTER, SET_TASK_FILTER, SET_KEEP_AWAKE } from './taskActions'

/*
 * Intital state shape for the task UI reducer
 * Data related to the presentation of task-related components
 * but not directly related to the entity itself goes here
 */
const tasksUiInitialState = {
  selectedDate: moment(), // Date selected by the user
  excludeFilters: [],     // Key-value pairs of active filters (e.g. status: 'done')
  keepAwake: false,
}


export const tasksUiReducer = (state = tasksUiInitialState, action = {}) => {
  switch (action.type) {
    case LOAD_TASKS_REQUEST:
      return {
        ...state,
        selectedDate: action.payload || moment(),
      }

    case ADD_TASK_FILTER:
    case SET_TASK_FILTER:
      return {
        ...state,
        excludeFilters: state.excludeFilters.concat(action.payload),
      }

    case SET_KEEP_AWAKE:
      return {
        ...state,
        keepAwake: action.payload,
      }

    case CLEAR_TASK_FILTER:
      // Empty payload clears all exclusion rules
      if (!action.payload) {
        return {
          ...state,
          excludeFilters: [],
        }
      }

      // Filters with any matches to exclusion rules are removed from the payload
      return {
        ...state,
        excludeFilters: state.excludeFilters.filter(filter =>
          Object.keys(action.payload).some(k => action.payload[k] !== filter[k])),
      }
  }

  return state
}
