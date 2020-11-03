import {
  CHANGE_DATE,
  LOAD_TASK_LISTS_SUCCESS,
  ASSIGN_TASK_SUCCESS,
  UNASSIGN_TASK_SUCCESS, CREATE_TASK_SUCCESS,
} from "../Dispatch/actions";
import { taskListUtils as utils } from '../../coopcycle-frontend-js/lastmile/redux'

const initialState = {
  items: new Map(),
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DATE:
      return {
        ...state,
        items: new Map(),
      }
    case LOAD_TASK_LISTS_SUCCESS: {
      let newItems = new Map(state.items)

      let entities = action.payload.map(taskList => utils.replaceTasksWithIds(taskList))
      entities.forEach(taskList => newItems.set(taskList[utils.taskListKey], taskList))

      return {
        ...state,
        items: newItems,
      }
    }
    case CREATE_TASK_SUCCESS: {
      let task = action.payload

      if (task.isAssigned) {
        let newItems = utils.addAssignedTask(state, task)

        return {
          ...state,
          items: newItems,
        }

      } else {
        return state
      }
    }
    case ASSIGN_TASK_SUCCESS:
      return {
        ...state,
        items: utils.addAssignedTask(state, action.payload),
      }
    case UNASSIGN_TASK_SUCCESS:
      return {
        ...state,
        items: utils.removeUnassignedTask(state, action.payload),
      }
    default:
      return state
  }
}
