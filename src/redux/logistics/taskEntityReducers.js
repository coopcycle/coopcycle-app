import {
  CHANGE_DATE,
  LOAD_TASK_LISTS_SUCCESS,
  LOAD_UNASSIGNED_TASKS_SUCCESS,
  CREATE_TASK_SUCCESS,
  CANCEL_TASK_SUCCESS,
  ASSIGN_TASK_SUCCESS,
  UNASSIGN_TASK_SUCCESS,
} from '../Dispatch/actions';
import {
  START_TASK_SUCCESS,
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_SUCCESS,
} from '../Courier';

import {
  taskUtils,
  taskListUtils,
} from '../../coopcycle-frontend-js/logistics/redux'

const initialState = {
  byId: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DATE:
      return {
        ...state,
        byId: {},
      }
    case LOAD_UNASSIGNED_TASKS_SUCCESS: {
      let newItems = taskUtils.addOrReplaceTasks(state.byId, action.payload)

      return {
        ...state,
        byId: newItems,
      }
    }
    case LOAD_TASK_LISTS_SUCCESS: {
      let assignedTasks = taskListUtils.assignedTasks(action.payload)
      let newItems = taskUtils.addOrReplaceTasks(state.byId, assignedTasks)

      return {
        ...state,
        byId: newItems,
      }
    }
    case CREATE_TASK_SUCCESS:
    case CANCEL_TASK_SUCCESS:
    case ASSIGN_TASK_SUCCESS:
    case UNASSIGN_TASK_SUCCESS:
    case START_TASK_SUCCESS:
    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS: {
      let task = action.payload
      let newItems = taskUtils.addOrReplaceTasks(state.byId, [task])

      return {
        ...state,
        byId: newItems,
      }
    }
    default:
      return state
  }
}
