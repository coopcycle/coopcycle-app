import {
  LOAD_UNASSIGNED_TASKS_REQUEST,
  LOAD_UNASSIGNED_TASKS_SUCCESS,
  LOAD_UNASSIGNED_TASKS_FAILURE,
  LOAD_USERS_REQUEST,
  LOAD_USERS_SUCCESS,
  LOAD_USERS_FAILURE,
  LOAD_TASK_LISTS_REQUEST,
  LOAD_TASK_LISTS_SUCCESS,
  LOAD_TASK_LISTS_FAILURE,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  ASSIGN_TASK_REQUEST,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_FAILURE,
  UNASSIGN_TASK_REQUEST,
  UNASSIGN_TASK_SUCCESS,
  UNASSIGN_TASK_FAILURE,
  CANCEL_TASK_SUCCESS,
} from '../Dispatch/actions'

const initialState = {
  taskListsLoading: false,
  isFetching: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS_REQUEST:
    case LOAD_UNASSIGNED_TASKS_REQUEST:
    case LOAD_TASK_LISTS_REQUEST:
    case CREATE_TASK_REQUEST:
    case ASSIGN_TASK_REQUEST:
    case UNASSIGN_TASK_REQUEST:
      return {
        ...state,
        isFetching: true,
      }

    case LOAD_USERS_FAILURE:
    case LOAD_UNASSIGNED_TASKS_FAILURE:
    case LOAD_TASK_LISTS_FAILURE:
    case CREATE_TASK_FAILURE:
    case ASSIGN_TASK_FAILURE:
    case UNASSIGN_TASK_FAILURE:
      return {
        ...state,
        isFetching: false,
      }

    case LOAD_USERS_SUCCESS:
    case LOAD_UNASSIGNED_TASKS_SUCCESS:
    case LOAD_TASK_LISTS_SUCCESS:
    case CREATE_TASK_SUCCESS:
    case CANCEL_TASK_SUCCESS:
    case ASSIGN_TASK_SUCCESS:
    case UNASSIGN_TASK_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}
