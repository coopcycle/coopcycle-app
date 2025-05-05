import { createAction } from '@reduxjs/toolkit';

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

export const createTaskRequest = createAction('@logistics/CREATE_TASK_REQUEST');
export const createTaskSuccess = createAction('@logistics/CREATE_TASK_SUCCESS');
export const createTaskFailure = createAction('@logistics/CREATE_TASK_FAILURE');

export const cancelTaskSuccess = createAction('@logistics/CANCEL_TASK_SUCCESS');

export const assignTaskSuccess = createAction(DEP_ASSIGN_TASK_SUCCESS);

export const updateTaskSuccess = createAction(DEP_UPDATE_TASK_SUCCESS);

export const unassignTaskSuccess = createAction(DEP_UNASSIGN_TASK_SUCCESS);

export const createTaskListRequest = createAction(CREATE_TASK_LIST_REQUEST);
export const createTaskListSuccess = createAction(CREATE_TASK_LIST_SUCCESS);
export const createTaskListFailure = createAction(CREATE_TASK_LIST_FAILURE);

export const updateTaskListsSuccess = createAction('@logistics/UPDATE_TASK_LIST_SUCCESS');

export const loadToursSuccess = createAction('logistics/LOAD_TOURS_SUCCESS');
export const loadToursFailure = createAction('logistics/LOAD_TOURS_FAILURE');

export const createTourSuccess = createAction('@logistics/CREATE_TOUR_SUCCESS');
export const updateTourSuccess = createAction(DEP_UPDATE_TOUR_SUCCESS);
// For future integration with web socket
export const deleteTourSuccess = createAction('@logistics/DELETE_TOUR_SUCCESS');

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
