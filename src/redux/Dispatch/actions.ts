import { createAction } from '@reduxjs/toolkit';

import { connectCentrifugo } from '../middlewares/CentrifugoMiddleware/actions';
import { DEP_CHANGE_DATE } from '../../coopcycle-frontend-js/logistics/redux';

/*
 * Action Creators
 */

export const loadTasksRequest = createAction('@dispatch/LOAD_TASKS_REQUEST');
export const loadTasksSuccess = createAction('@dispatch/LOAD_TASKS_SUCCESS');
export const loadTasksFailure = createAction('@dispatch/LOAD_TASKS_FAILURE');

export const loadUsersRequest = createAction('@dispatch/LOAD_USERS_REQUEST');
export const loadUsersSuccess = createAction('@dispatch/LOAD_USERS_SUCCESS');
export const loadUsersFailure = createAction('@dispatch/LOAD_USERS_FAILURE');

export const loadTaskListsRequest = createAction(
  '@dispatch/LOAD_TASK_LISTS_REQUEST',
);
export const loadTaskListsSuccess = createAction(
  '@dispatch/LOAD_TASK_LISTS_SUCCESS',
);
export const loadTaskListsFailure = createAction(
  '@dispatch/LOAD_TASK_LISTS_FAILURE',
);

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

