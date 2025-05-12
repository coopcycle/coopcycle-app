import { CommonActions } from '@react-navigation/native';
import { createAction } from '@reduxjs/toolkit';

import { connectCentrifugo } from '../middlewares/CentrifugoMiddleware/actions';
import {
  DEP_CHANGE_DATE,
  createTaskFailure,
  createTaskListFailure,
  createTaskListRequest,
  createTaskListSuccess,
  createTaskRequest,
  createTaskSuccess,
  selectSelectedDate,
} from '../../coopcycle-frontend-js/logistics/redux';
import { isSameDayTask } from '../../shared/src/utils';
import { showAlert } from '../../utils/alert';
import NavigationHolder from '../../NavigationHolder';
import {
  isSameDayTask,
  isSameDayTaskList,
  isSameDayTour,
} from './utils';
import {
  markTaskDoneSuccess,
  markTaskFailedSuccess,
  startTaskSuccess,
} from '../Courier';
import { showAlert } from '../../utils/alert';
import NavigationHolder from '../../NavigationHolder';

/*
 * Action Types
 */

// TODO: Change to createAction declaration from '@reduxjs/toolkit'
export const DEP_ASSIGN_TASK_SUCCESS = 'ASSIGN_TASK_SUCCESS';
export const DEP_BULK_ASSIGNMENT_TASKS_SUCCESS = 'BULK_ASSIGNMENT_TASKS_SUCCESS';
export const DEP_CHANGE_DATE = 'CHANGE_DATE';
export const DEP_UNASSIGN_TASK_SUCCESS = 'UNASSIGN_TASK_SUCCESS';
export const DEP_UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const DEP_UPDATE_TOUR_SUCCESS = 'UPDATE_TOUR_SUCCESS';


/*
 * Action Creators
 */

export const loadTasksRequest = createAction('@dispatch/LOAD_TASKS_REQUEST');
export const loadTasksSuccess = createAction('@dispatch/LOAD_TASKS_SUCCESS');
export const loadTasksFailure = createAction('@dispatch/LOAD_TASKS_FAILURE');

export const loadUsersRequest = createAction('@dispatch/LOAD_USERS_REQUEST');
export const loadUsersSuccess = createAction('@dispatch/LOAD_USERS_SUCCESS');
export const loadUsersFailure = createAction('@dispatch/LOAD_USERS_FAILURE');

export const loadTaskListsRequest = createAction('@dispatch/LOAD_TASK_LISTS_REQUEST');
export const loadTaskListsSuccess = createAction('@dispatch/LOAD_TASK_LISTS_SUCCESS');
export const loadTaskListsFailure = createAction('@dispatch/LOAD_TASK_LISTS_FAILURE');

export const updateTaskListsSuccess = createAction('@dispatch/UPDATE_TASK_LIST_SUCCESS');

export const assignTasksRequest = createAction('@dispatch/ASSIGN_TASKS_REQUEST');
export const assignTasksSuccess = createAction('@dispatch/ASSIGN_TASKS_SUCCESS');
export const assignTasksFailure = createAction('@dispatch/ASSIGN_TASKS_FAILURE');

export const createTaskRequest = createAction('@dispatch/CREATE_TASK_REQUEST');
export const createTaskSuccess = createAction('@dispatch/CREATE_TASK_SUCCESS');
export const createTaskFailure = createAction('@dispatch/CREATE_TASK_FAILURE');

export const cancelTaskRequest = createAction('@dispatch/CANCEL_TASK_REQUEST');
export const cancelTaskSuccess = createAction('@dispatch/CANCEL_TASK_SUCCESS');
export const cancelTaskFailure = createAction('@dispatch/CANCEL_TASK_FAILURE');

export const assignTaskSuccess = createAction(DEP_ASSIGN_TASK_SUCCESS);

export const updateTaskSuccess = createAction(DEP_UPDATE_TASK_SUCCESS);

export const unassignTaskSuccess = createAction(DEP_UNASSIGN_TASK_SUCCESS);

export const createTourSuccess = createAction('@dispatch/CREATE_TOUR_SUCCESS');

export const updateTourSuccess = createAction(DEP_UPDATE_TOUR_SUCCESS);
export const unassignTasksSuccess = createAction('@dispatch/UNASSIGN_TASKS_SUCCESS');

export const changeDate = createAction(DEP_CHANGE_DATE);
export const initialized = createAction('@dispatch/DISPATCH_INITIALIZE');


export function initialize() {
  return function (dispatch, getState) {
    const stateInitialized = getState().dispatch.initialized;

    if (stateInitialized) {
      return;
    }

    dispatch(connectCentrifugo());
    dispatch(initialized());
  };
}

export function createTaskList(date, user) {
  return function (dispatch, getState) {
    const httpClient = getState().app.httpClient;

    dispatch(createTaskListRequest());

    return httpClient
      .post('/api/task_lists', {
        date: date.format('YYYY-MM-DD'),
        courier: user['@id'],
      })
      .then(res => dispatch(createTaskListSuccess(res)))
      .catch(e => dispatch(createTaskListFailure(e)));
  };
}

export function createTask(task) {
  return function (dispatch, getState) {
    const httpClient = getState().app.httpClient;

    dispatch(createTaskRequest());

    return httpClient
      .post('/api/tasks', task)
      .then(t => {
        let date = selectSelectedDate(getState());

        if (isSameDayTask(t, date)) {
          dispatch(createTaskSuccess(t));
        }

        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
        NavigationHolder.dispatch(resetAction);
      })
      .catch(e => {
        dispatch(createTaskFailure(e));
        setTimeout(() => showAlert(e), 100);
      });
  };
}

export function updateTask(action, task) {
  return function (dispatch, getState) {
    let date = selectSelectedDate(getState());

    if (isSameDayTask(task, date)) {
      switch (action) {
        case 'task:created':
          dispatch(createTaskSuccess(task));
          break;
        case 'task:cancelled':
          dispatch(cancelTaskSuccess(task));
          break;
        case 'task:assigned':
          dispatch(assignTaskSuccess(task));
          break;
        case 'task:unassigned':
          dispatch(unassignTaskSuccess(task));
          break;
        case 'task:started':
          dispatch(startTaskSuccess(task));
          break;
        case 'task:done':
          dispatch(markTaskDoneSuccess(task));
          break;
        case 'task:updated':
          dispatch(updateTaskSuccess(task));
          break;
        case 'task:failed':
          dispatch(markTaskFailedSuccess(task));
          break;
      }
    }
  };
}

export function updateTaskList(action, taskList) {
  return function (dispatch, getState) {
    let date = selectSelectedDate(getState());

    if (isSameDayTaskList(taskList, date)) {
      switch (action) {
        case 'v2:task_list:updated':
          dispatch(updateTaskListsSuccess(taskList));
          break;
      }
    }
  }
}

export function updateTour(action, tour) {
  return function (dispatch, getState) {
    let date = selectSelectedDate(getState());

    if (isSameDayTour(tour, date)) {
      switch (action) {
        case 'tour:created':
          dispatch(createTourSuccess(tour));
          break;
        case 'tour:updated':
          dispatch(updateTourSuccess(tour));
          break;
      }
    }
  }
}
