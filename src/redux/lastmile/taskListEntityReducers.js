import {
  CHANGE_DATE,
  LOAD_TASK_LISTS_SUCCESS,
  ASSIGN_TASK_SUCCESS,
  UNASSIGN_TASK_SUCCESS, CREATE_TASK_SUCCESS,
} from '../Dispatch/actions';
import { taskListUtils as utils } from '../../coopcycle-frontend-js/lastmile/redux'

const initialState = {
  byUsername: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DATE:
      return {
        ...state,
        byUsername: {},
      }
    case LOAD_TASK_LISTS_SUCCESS: {
      let newItems = Object.assign({}, state.byUsername)

      let entities = action.payload.map(taskList => utils.replaceTasksWithIds(taskList))
      entities.forEach(taskList => {
        newItems[taskList[utils.taskListKey]] = taskList
      })

      return {
        ...state,
        byUsername: newItems,
      }
    }
    case CREATE_TASK_SUCCESS: {
      let task = action.payload

      if (task.isAssigned) {
        let newItems = utils.addAssignedTask(state, task)

        return {
          ...state,
          byUsername: newItems,
        }

      } else {
        return state
      }
    }
    case ASSIGN_TASK_SUCCESS:
      return {
        ...state,
        byUsername: utils.addAssignedTask(state, action.payload),
      }
    case UNASSIGN_TASK_SUCCESS:
      return {
        ...state,
        byUsername: utils.removeUnassignedTask(state, action.payload),
      }
    default:
      return state
  }
}
