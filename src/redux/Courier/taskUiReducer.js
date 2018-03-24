/*
 * Task related reducers
 */
import moment from 'moment/min/moment-with-locales'
import { LOAD_TASKS_REQUEST } from './taskActions'
import { localeDetector } from '../../i18n'


moment.locale(localeDetector())


/*
 * Intital state shape for the task UI reducer
 * Data related to the presentation of task-related components
 * but not directly related to the entity itself goes here
 */
const tasksUiInitialState = {
  selectedDate: moment()  // Date selected by the user
}


export const tasksUiReducer = (state = tasksUiInitialState, action) => {
  switch (action.type) {
    case LOAD_TASKS_REQUEST:
      return {
        ...state,
        selectedDate: action.payload || moment()
      }
    default:
      return { ...state }
  }
}
