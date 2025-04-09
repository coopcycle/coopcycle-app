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
import {
  loadToursFailure,
  loadToursSuccess,
} from '../../shared/logistics/redux';


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
    loadToursFailure,
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
    loadToursSuccess,
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

  return state;
};
