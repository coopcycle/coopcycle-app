import { createAction } from '@reduxjs/toolkit';
import { createAction as createFsAction } from 'redux-actions';

import { selectSelectedDate } from './selectors';
import {
    isSameDayTaskList,
    isSameDayTour,
} from './utils';

/*
 * Action Types
 */

// TODO: Change to createAction declaration from '@reduxjs/toolkit'
export const CREATE_TASK_LIST_REQUEST = 'CREATE_TASK_LIST_REQUEST';
export const CREATE_TASK_LIST_SUCCESS = 'CREATE_TASK_LIST_SUCCESS';
export const CREATE_TASK_LIST_FAILURE = 'CREATE_TASK_LIST_FAILURE';

export const createTaskListRequest = createFsAction(CREATE_TASK_LIST_REQUEST);
export const createTaskListSuccess = createFsAction(CREATE_TASK_LIST_SUCCESS);
export const createTaskListFailure = createFsAction(CREATE_TASK_LIST_FAILURE);

export const updateTaskListsSuccess = createAction('@logistics/UPDATE_TASK_LIST_SUCCESS');

export const createTourSuccess = createAction('@logistics/CREATE_TOUR_SUCCESS');
export const deleteTourSuccess = createAction('@logistics/DELETE_TOUR_SUCCESS'); // For future integration with web socket
export const loadToursSuccess = createAction('@logistics/LOAD_TOURS_SUCCESS');
export const loadToursFailure = createAction('@logistics/LOAD_TOURS_FAILURE');
export const updateTourSuccess = createAction('@logistics/UPDATE_TOUR_SUCCESS');



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
