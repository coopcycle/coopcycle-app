import { actionMatchCreator } from '../util';
import {
  ASSIGN_TASK_FAILURE,
  ASSIGN_TASK_REQUEST,
  ASSIGN_TASK_SUCCESS,
  BULK_ASSIGNMENT_TASKS_FAILURE,
  BULK_ASSIGNMENT_TASKS_REQUEST,
  BULK_ASSIGNMENT_TASKS_SUCCESS,
  UNASSIGN_TASK_FAILURE,
  UNASSIGN_TASK_REQUEST,
  UNASSIGN_TASK_SUCCESS,
  cancelTaskSuccess,
  createTaskFailure,
  createTaskRequest,
  createTaskSuccess,
  loadTaskListsFailure,
  loadTaskListsRequest,
  loadTaskListsSuccess,
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
    createTaskRequest,
    loadTaskListsRequest,
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
    createTaskFailure,
    loadTaskListsFailure,
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
    cancelTaskSuccess,
    createTaskSuccess,
    loadTaskListsSuccess,
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
    case UNASSIGN_TASK_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ASSIGN_TASK_FAILURE:
    case LOAD_TOURS_FAILURE:
    case UNASSIGN_TASK_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case ASSIGN_TASK_SUCCESS:
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
