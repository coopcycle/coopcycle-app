import { actionMatchCreator } from '../util';
import {
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
import {
  assignTasksFailure,
  assignTasksRequest,
  assignTasksWithUiUpdateSuccess,
  cancelTaskSuccess,
  createTaskFailure,
  createTaskRequest,
  createTaskSuccess,
  loadToursFailure,
  loadToursSuccess,
  unassignTasksWithUiUpdateSuccess,
} from '../../shared/logistics/redux';

const initialState = {
  isAssigningTasks: false,
  isFetching: false,
  taskListsLoading: false,
};

export default (state = initialState, action) => {
  if (
    actionMatchCreator(action, [
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

  if (
    actionMatchCreator(action, [
      createTaskFailure,
      loadTaskListsFailure,
      loadTasksFailure,
      loadToursFailure,
      loadUsersFailure,
    ])
  ) {
    return {
      ...state,
      isFetching: false,
    };
  }

  if (
    actionMatchCreator(action, [
      cancelTaskSuccess,
      createTaskSuccess,
      loadTaskListsSuccess,
      loadTasksSuccess,
      loadToursSuccess,
      loadUsersSuccess,
    ])
  ) {
    return {
      ...state,
      isFetching: false,
    };
  }

  if (actionMatchCreator(action, [assignTasksRequest])) {
    return {
      ...state,
      isAssigningTasks: true,
    };
  }

  if (actionMatchCreator(action, [assignTasksFailure])) {
    return {
      ...state,
      isAssigningTasks: false,
    };
  }

  if (
    actionMatchCreator(action, [
      assignTasksWithUiUpdateSuccess,
      unassignTasksWithUiUpdateSuccess,
    ])
  ) {
    return {
      ...state,
      isAssigningTasks: false,
    };
  }

  return state;
};
