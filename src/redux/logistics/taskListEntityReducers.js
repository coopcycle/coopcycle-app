import {
  CHANGE_DATE,
  LOAD_TASK_LISTS_SUCCESS,
  ASSIGN_TASK_SUCCESS,
  UNASSIGN_TASK_SUCCESS, CREATE_TASK_SUCCESS,
} from '../Dispatch/actions';
import { taskListUtils as utils } from '../../coopcycle-frontend-js/logistics/redux'

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
      let entities = action.payload.map(taskList => utils.replaceTasksWithIds(taskList))
      let newItems = utils.upsertTaskLists(state.byId, entities)

      return {
        ...state,
        byId: newItems,
      }
    }
    case CREATE_TASK_SUCCESS: {
      let task = action.payload

      if (task.isAssigned) {
        let newItems = utils.addAssignedTask(state.byId, task)

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
        byId: utils.addAssignedTask(state.byId, action.payload),
      }
    case UNASSIGN_TASK_SUCCESS:
      return {
        ...state,
        byId: utils.removeUnassignedTask(state.byId, action.payload),
      }
    default:
      return state
  }
}
