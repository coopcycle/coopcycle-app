import { createAction } from '@reduxjs/toolkit';

import { selectSelectedDate } from './selectors';
import {
  isSameDayTask,
  isSameDayTaskList,
  isSameDayTour,
} from '../../utils';


/*
 * Action Types
 */

// TODO: Change to createAction declaration from '@reduxjs/toolkit'
export const DEP_ASSIGN_TASK_SUCCESS = 'ASSIGN_TASK_SUCCESS';
export const DEP_BULK_ASSIGNMENT_TASKS_SUCCESS = 'BULK_ASSIGNMENT_TASKS_SUCCESS';
export const DEP_CHANGE_DATE = 'CHANGE_DATE';
export const DEP_UNASSIGN_TASK_SUCCESS = 'UNASSIGN_TASK_SUCCESS';
export const DEP_UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';

export const createTaskRequest = createAction('@logistics/CREATE_TASK_REQUEST');
export const createTaskSuccess = createAction('@logistics/CREATE_TASK_SUCCESS');
export const createTaskFailure = createAction('@logistics/CREATE_TASK_FAILURE');

export const cancelTaskSuccess = createAction('@logistics/CANCEL_TASK_SUCCESS');
export const assignTaskSuccess = createAction(DEP_ASSIGN_TASK_SUCCESS);
export const updateTaskSuccess = createAction(DEP_UPDATE_TASK_SUCCESS);
export const unassignTaskSuccess = createAction(DEP_UNASSIGN_TASK_SUCCESS);

export const assignTasksFailure = createAction('@logistics/ASSIGN_TASKS_FAILURE');
export const assignTasksRequest = createAction('@logistics/ASSIGN_TASKS_REQUEST');
export const assignTasksSuccess = createAction('@logistics/ASSIGN_TASKS_SUCCESS');

export const assignTasksWithUiUpdateSuccess = createAction('@logistics/ASSIGN_TASKS_WITH_UI_UPDATE_SUCCESS');

export const unassignTasksWithUiUpdateSuccess = createAction('@logistics/UNASSIGN_TASKS_WITH_UI_UPDATE_SUCCESS');

export const disableCentrifugoUpdateForTasksIds = createAction('@logistics/DISABLE_CENTRIFUGO_UPDATE_FOR_TASKS_IDS');
export const disableCentrifugoUpdateForUsers = createAction('@logistics/DISABLE_CENTRIFUGO_UPDATE_FOR_USER');
export const restoreCentrifugoUpdate = createAction('@logistics/RESTORE_CENTRIFUGO_UPDATE');

export const startTaskRequest = createAction('@logistics/START_TASK_REQUEST');
export const startTaskSuccess = createAction('@logistics/START_TASK_SUCCESS');
export const startTaskFailure = createAction('@logistics/START_TASK_FAILURE');

export const markTaskDoneRequest = createAction('@logistics/MARK_TASK_DONE_REQUEST');
export const markTaskDoneSuccess = createAction('@logistics/MARK_TASK_DONE_SUCCESS');
export const markTaskDoneFailure = createAction('@logistics/MARK_TASK_DONE_FAILURE');

export const markTaskFailedRequest = createAction('@logistics/MARK_TASK_FAILED_REQUEST');
export const markTaskFailedSuccess = createAction('@logistics/MARK_TASK_FAILED_SUCCESS');
export const markTaskFailedFailure = createAction('@logistics/MARK_TASK_FAILED_FAILURE');

export const createTaskListRequest = createAction('@logistics/CREATE_TASK_LIST_REQUEST');
export const createTaskListSuccess = createAction('@logistics/CREATE_TASK_LIST_SUCCESS');
export const createTaskListFailure = createAction('@logistics/CREATE_TASK_LIST_FAILURE');

export const updateTaskListsSuccess = createAction('@logistics/UPDATE_TASK_LIST_SUCCESS');

export const createTourSuccess = createAction('@logistics/CREATE_TOUR_SUCCESS');
export const deleteTourSuccess = createAction('@logistics/DELETE_TOUR_SUCCESS'); // For future integration with web socket
export const loadToursFailure = createAction('logistics/LOAD_TOURS_FAILURE');
export const loadToursSuccess = createAction('logistics/LOAD_TOURS_SUCCESS');
export const updateTourSuccess = createAction('@logistics/UPDATE_TOUR_SUCCESS');

export function updateTask(action, task) {
  return function (dispatch, getState) {
    const prevState = getState();
    let date = selectSelectedDate(prevState);

    if (prevState.logistics.ui.disabledCentrifugoUpdatesForTasksIds.length > 0
      && prevState.logistics.ui.disabledCentrifugoUpdatesForTasksIds.includes(task['@id'])
    ) {
      return;
    }

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
    const prevState = getState();
    let date = selectSelectedDate(prevState);

    if (prevState.logistics.ui.disabledCentrifugoUpdatesForUsers.length > 0
      && prevState.logistics.ui.disabledCentrifugoUpdatesForUsers.includes(taskList.username)
    ) {
      return;
    }

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
