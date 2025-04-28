import { actionMatchCreator } from '../util';
import {
  assignTaskFailure,
  assignTaskRequest,
  assignTaskSuccess,
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
