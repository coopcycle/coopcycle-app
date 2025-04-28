import { actionMatchCreator } from '../util';
import {
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
  updateTaskListTasksFailure,
  updateTaskListTasksRequest,
  updateTaskListTasksSuccess,
} from '../Dispatch/actions';
import {
  loadToursFailure,
  loadToursSuccess,
} from '../../shared/logistics/redux';


const initialState = {
  isAssigningTasks: false,
  isFetching: false,
  taskListsLoading: false,
};

export default (state = initialState, action) => {
  if (actionMatchCreator(action, [
    createTaskRequest,
    loadTaskListsRequest,
    loadTasksRequest,
    loadUsersRequest,
  ])) {
    return {
      ...state,
      isFetching: true,
    };
  }

  if (actionMatchCreator(action, [
    createTaskFailure,
    loadTaskListsFailure,
    loadTasksFailure,
    loadToursFailure,
    loadUsersFailure,
  ])) {
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
    loadToursSuccess,
    loadUsersSuccess,
  ])) {
    return {
      ...state,
      isFetching: false,
    };
  }

  if (actionMatchCreator(action, [
    updateTaskListTasksRequest,
  ])) {
    return {
      ...state,
      isAssigningTasks: true,
    };
  }

  if (actionMatchCreator(action, [
    updateTaskListTasksFailure,
  ])) {
    return {
      ...state,
      isAssigningTasks: false,
    };
  }

  if (actionMatchCreator(action, [
    updateTaskListTasksSuccess,
  ])) {
    return {
      ...state,
      isAssigningTasks: false,
    };
  }

  return state;
};
