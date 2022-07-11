import {
  ASSIGN_TASK_SUCCESS,
  CHANGE_DATE,
  CREATE_TASK_SUCCESS,
  LOAD_TASK_LISTS_SUCCESS, UNASSIGN_TASK_SUCCESS,
} from '../Dispatch/actions';
import {
  taskListEntityUtils,
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
    case LOAD_TASK_LISTS_SUCCESS: {
      let entities = action.payload.map(taskList => taskListUtils.replaceTasksWithIds(taskList))
      let newItems = taskListEntityUtils.addOrReplaceTaskLists(state.byId, entities)

      return {
        ...state,
        byId: newItems,
      }
    }
    case CREATE_TASK_SUCCESS: {
      let task = action.payload

      if (task.isAssigned) {
        let newItems = taskListEntityUtils.addAssignedTask(state.byId, task)

        return {
          ...state,
          byId: newItems,
        }

      } else {
        return state
      }
    }
    case ASSIGN_TASK_SUCCESS:
      return {
        ...state,
        byId: taskListEntityUtils.addAssignedTask(state.byId, action.payload),
      }
    case UNASSIGN_TASK_SUCCESS:
      return {
        ...state,
        byId: taskListEntityUtils.removeUnassignedTask(state.byId, action.payload),
      }
    default:
      return state
  }
}
