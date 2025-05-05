import { createAction } from '@reduxjs/toolkit';
import { createAction as createFsAction } from 'redux-actions';

import {
  markTaskDoneSuccess,
  markTaskFailedSuccess,
  startTaskSuccess,
} from '../../../../redux/Courier';;
import { selectSelectedDate } from './selectors';
import {
  DEP_ASSIGN_TASK_SUCCESS,
  DEP_UNASSIGN_TASK_SUCCESS,
  DEP_UPDATE_TASK_SUCCESS,
  DEP_UPDATE_TOUR_SUCCESS,
} from '../../../../redux/Dispatch/actions';
import {
  isSameDayTask,
  isSameDayTaskList,
  isSameDayTour,
} from '../../../../redux/Dispatch/utils';


export const CREATE_TASK_LIST_REQUEST = 'CREATE_TASK_LIST_REQUEST';
export const CREATE_TASK_LIST_SUCCESS = 'CREATE_TASK_LIST_SUCCESS';
export const CREATE_TASK_LIST_FAILURE = 'CREATE_TASK_LIST_FAILURE';

// For future integration with web socket
export const DELETE_TOUR_SUCCESS = 'DELETE_TOUR_SUCCESS';
export const UPDATE_TOUR = 'UPDATE_TOUR';

export const createTaskRequest = createFsAction('@logistics/CREATE_TASK_REQUEST');
export const createTaskSuccess = createFsAction('@logistics/CREATE_TASK_SUCCESS');
export const createTaskFailure = createFsAction('@logistics/CREATE_TASK_FAILURE');

export const cancelTaskSuccess = createFsAction('@logistics/CANCEL_TASK_SUCCESS');

export const assignTaskSuccess = createFsAction(DEP_ASSIGN_TASK_SUCCESS);

export const updateTaskSuccess = createFsAction(DEP_UPDATE_TASK_SUCCESS);

export const unassignTaskSuccess = createFsAction(DEP_UNASSIGN_TASK_SUCCESS);

export const createTaskListRequest = createFsAction(CREATE_TASK_LIST_REQUEST);
export const createTaskListSuccess = createFsAction(CREATE_TASK_LIST_SUCCESS);
export const createTaskListFailure = createFsAction(CREATE_TASK_LIST_FAILURE);

export const updateTaskListsSuccess = createFsAction('@logistics/UPDATE_TASK_LIST_SUCCESS');

export const createTourSuccess = createFsAction('@dispatch/CREATE_TOUR_SUCCESS');
export const updateTourSuccess = createFsAction(DEP_UPDATE_TOUR_SUCCESS);
export const deleteTourSuccess = createFsAction(DELETE_TOUR_SUCCESS);
export const loadToursSuccess = createAction('LOAD_TOURS_SUCCESS');
export const loadToursFailure = createAction('LOAD_TOURS_FAILURE');
export const updateTour = createFsAction(UPDATE_TOUR);

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

export function updateTourBis(action, tour) {
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
