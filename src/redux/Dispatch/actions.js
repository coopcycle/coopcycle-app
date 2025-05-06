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
import { isSameDayTask } from './utils';
import { showAlert } from '../../utils/alert';
import NavigationHolder from '../../NavigationHolder';


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
