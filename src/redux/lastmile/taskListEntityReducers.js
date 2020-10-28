import {
  ASSIGN_TASK_SUCCESS,
  CHANGE_DATE,
  LOAD_TASK_LISTS_SUCCESS,
  LOAD_TASK_SUCCESS,
  UNASSIGN_TASK_SUCCESS
} from "../Dispatch/actions";
import { taskListUtils, objectUtils } from '../../coopcycle-frontend-js/lastmile/redux'
import _ from "lodash"

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
      let newItems = objectUtils.copyMap(state.items)

      let taskLists = action.payload.map(taskList => taskListUtils.replaceTasksWithIds(taskList))
      taskLists.forEach(taskList => newItems.set(taskList["@id"], taskList))

      return {
        ...state,
        items: newItems,
      }
    }
    case LOAD_TASK_SUCCESS: {
      let task = action.payload

      let newItems

      if (task.isAssigned) {
        newItems = taskListUtils.addAssignedTask(state, task)
      } else {
        newItems = taskListUtils.removeUnassignedTask(state, task)
      }

      return {
        ...state,
        items: newItems,
      }
    }
    case ASSIGN_TASK_SUCCESS:
      return {
        ...state,
        items: taskListUtils.addAssignedTask(state, action.payload),
      }
    case UNASSIGN_TASK_SUCCESS:
      return {
        ...state,
        items: taskListUtils.removeUnassignedTask(state, action.payload),
      }
    default:
      return state
  }
}
