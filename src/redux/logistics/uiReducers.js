import { actionMatchCreator } from '../util';
import {
  ASSIGN_TASK_FAILURE,
  ASSIGN_TASK_REQUEST,
  ASSIGN_TASK_SUCCESS,
  BULK_ASSIGNMENT_TASKS_FAILURE,
  BULK_ASSIGNMENT_TASKS_REQUEST,
  BULK_ASSIGNMENT_TASKS_SUCCESS,
  CANCEL_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  LOAD_TASK_LISTS_FAILURE,
  LOAD_TASK_LISTS_REQUEST,
  LOAD_TASK_LISTS_SUCCESS,
  UNASSIGN_TASK_FAILURE,
  UNASSIGN_TASK_REQUEST,
  UNASSIGN_TASK_SUCCESS,
  loadTasksFailure,
  loadTasksRequest,
  loadTasksSuccess,
  loadUsersFailure,
  loadUsersRequest,
  loadUsersSuccess,
} from '../Dispatch/actions';
import { LOAD_TOURS_FAILURE, LOAD_TOURS_SUCCESS } from '../../shared/logistics/redux';

const initialState = {
  isBulkAssigning: false,
  isFetching: false,
  taskListsLoading: false,
};

export default (state = initialState, action) => {
  if (actionMatchCreator(action, [
    loadTasksRequest,
    loadUsersRequest,
  ])
  ) {
    return {
      ...state,
      isFetching: true,
    };
  }

  if (actionMatchCreator(action, [
    loadTasksFailure,
    loadUsersFailure,
  ])
  ) {
    return {
      ...state,
      isFetching: false,
    };
  }

  if (actionMatchCreator(action, [
    loadTasksSuccess,
    loadUsersSuccess,
  ])
  ) {
    return {
      ...state,
      isFetching: false,
    };
  }

  switch (action.type) {
    case ASSIGN_TASK_REQUEST:
    case CREATE_TASK_REQUEST:
    case LOAD_TASK_LISTS_REQUEST:
    case UNASSIGN_TASK_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ASSIGN_TASK_FAILURE:
    case CREATE_TASK_FAILURE:
    case LOAD_TASK_LISTS_FAILURE:
    case LOAD_TOURS_FAILURE:
    case UNASSIGN_TASK_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case ASSIGN_TASK_SUCCESS:
    case CANCEL_TASK_SUCCESS:
    case CREATE_TASK_SUCCESS:
    case LOAD_TASK_LISTS_SUCCESS:
    case LOAD_TOURS_SUCCESS:
    case UNASSIGN_TASK_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };

    case BULK_ASSIGNMENT_TASKS_REQUEST:
      return {
        ...state,
        isBulkAssigning: true,
      }

    case BULK_ASSIGNMENT_TASKS_FAILURE:
      return {
        ...state,
        isBulkAssigning: false,
      }

    case BULK_ASSIGNMENT_TASKS_SUCCESS:
      return {
        ...state,
        isBulkAssigning: false,
      }

    default:
      return state;
  }
};
