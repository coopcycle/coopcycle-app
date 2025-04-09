import { actionMatchCreator } from '../util';
import {
  assignTaskFailure,
  assignTaskRequest,
  assignTaskSuccess,
  bulkAssignmentTasksFailure,
  bulkAssignmentTasksRequest,
  bulkAssignmentTasksSuccess,
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
  unassignTaskFailure,
  unassignTaskRequest,
  unassignTaskSuccess,
} from '../Dispatch/actions';
import { LOAD_TOURS_FAILURE, LOAD_TOURS_SUCCESS } from '../../shared/logistics/redux';

const initialState = {
  isBulkAssigning: false,
  isFetching: false,
  taskListsLoading: false,
};

export default (state = initialState, action) => {
  if (actionMatchCreator(action, [
    assignTaskRequest,
    createTaskRequest,
    loadTaskListsRequest,
    loadTasksRequest,
    loadUsersRequest,
    unassignTaskRequest,
  ])) {
    return {
      ...state,
      isFetching: true,
    };
  }

  if (actionMatchCreator(action, [
    assignTaskFailure,
    createTaskFailure,
    loadTaskListsFailure,
    loadTasksFailure,
    loadUsersFailure,
    unassignTaskFailure,
  ])) {
    return {
      ...state,
      isFetching: false,
    };
  }

  if (actionMatchCreator(action, [
    assignTaskSuccess,
    cancelTaskSuccess,
    createTaskSuccess,
    loadTaskListsSuccess,
    loadTasksSuccess,
    loadUsersSuccess,
    unassignTaskSuccess,
  ])) {
    return {
      ...state,
      isFetching: false,
    };
  }

  if (actionMatchCreator(action, [
    bulkAssignmentTasksRequest,
  ])) {
    return {
      ...state,
      isBulkAssigning: true,
    };
  }

  if (actionMatchCreator(action, [
    bulkAssignmentTasksFailure,
  ])) {
    return {
      ...state,
      isBulkAssigning: false,
    };
  }

  if (actionMatchCreator(action, [
    bulkAssignmentTasksSuccess,
  ])) {
    return {
      ...state,
      isBulkAssigning: false,
    };
  }

  switch (action.type) {
    case LOAD_TOURS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case LOAD_TOURS_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
};
