import {
  CHANGE_DATE,
  LOAD_TASK_LISTS_SUCCESS,
  LOAD_UNASSIGNED_TASKS_SUCCESS,
  CREATE_TASK_SUCCESS,
  CANCEL_TASK_SUCCESS,
  ASSIGN_TASK_SUCCESS,
  UNASSIGN_TASK_SUCCESS,
} from "../Dispatch/actions";
import {
  START_TASK_SUCCESS,
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_SUCCESS
} from "../Courier";

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
    case LOAD_UNASSIGNED_TASKS_SUCCESS: {
      let newItems = new Map(state.items)

      action.payload.forEach(task => newItems.set(task['@id'], task))

      return {
        ...state,
        items: newItems,
      }
    }
    case LOAD_TASK_LISTS_SUCCESS: {
      let newItems = new Map(state.items)

      action.payload.forEach(taskList => {
        taskList.items.forEach(task => newItems.set(task['@id'], task))
      })

      return {
        ...state,
        items: newItems,
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

      let newItems = new Map(state.items)
      newItems.set(task['@id'], task)

      return {
        ...state,
        items: newItems,
      }
    }
    default:
      return state
  }
}
