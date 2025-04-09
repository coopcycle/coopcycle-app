import _ from 'lodash';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { createAction } from '@reduxjs/toolkit';
import { createAction as createFsAction } from 'redux-actions';

import NavigationHolder from '../../NavigationHolder';
import i18n from '../../i18n';
import { connectCentrifugo } from '../middlewares/CentrifugoMiddleware/actions';

import {
  createTaskListFailure,
  createTaskListRequest,
  createTaskListSuccess,
  selectAllTasks,
  selectSelectedDate,
  selectToursTasksIndex
} from '../../coopcycle-frontend-js/logistics/redux';

import {
  markTaskDoneSuccess,
  markTaskFailedSuccess,
  startTaskSuccess,
} from '../Courier';

import { withAssignedLinkedTasks, withUnassignedLinkedTasks } from '../../shared/src/logistics/redux/taskUtils';
import { isSameDateTask, isSameDateTaskList, isSameDateTour } from './utils';

/*
 * Action Types
 */
export const CREATE_TOUR_SUCCESS = '@dispatch/CREATE_TOUR_SUCCESS';
export const DEP_ASSIGN_TASK_SUCCESS = '@dispatch/ASSIGN_TASK_SUCCESS';
export const DEP_BULK_ASSIGNMENT_TASKS_SUCCESS = '@dispatch/BULK_ASSIGNMENT_TASKS_SUCCESS';
export const DEP_CHANGE_DATE = 'CHANGE_DATE';
export const DEP_UNASSIGN_TASK_SUCCESS = '@dispatch/UNASSIGN_TASK_SUCCESS';
export const UPDATE_TASK_LIST_SUCCESS = '@dispatch/UPDATE_TASK_LIST_SUCCESS';
export const UPDATE_TASK_SUCCESS = '@dispatch/UPDATE_TASK_SUCCESS';
export const UPDATE_TOUR_SUCCESS = '@dispatch/UPDATE_TOUR_SUCCESS';

/*
 * Action Creators
 */

export const loadTasksRequest = createAction('LOAD_TASKS_REQUEST');
export const loadTasksSuccess = createAction('LOAD_TASKS_SUCCESS');
export const loadTasksFailure = createAction('LOAD_TASKS_FAILURE');

export const loadUsersRequest = createAction('LOAD_USERS_REQUEST');
export const loadUsersSuccess = createAction('LOAD_USERS_SUCCESS');
export const loadUsersFailure = createAction('LOAD_USERS_FAILURE');

export const loadTaskListsRequest = createAction('LOAD_TASK_LISTS_REQUEST');
export const loadTaskListsSuccess = createAction('LOAD_TASK_LISTS_SUCCESS');
export const loadTaskListsFailure = createAction('LOAD_TASK_LISTS_FAILURE');

export const updateTaskListsSuccess = createFsAction(UPDATE_TASK_LIST_SUCCESS);

export const createTaskRequest = createAction('CREATE_TASK_REQUEST');
export const createTaskSuccess = createAction('CREATE_TASK_SUCCESS');
export const createTaskFailure = createAction('CREATE_TASK_FAILURE');

export const cancelTaskRequest = createAction('CANCEL_TASK_REQUEST');
export const cancelTaskSuccess = createAction('CANCEL_TASK_SUCCESS');
export const cancelTaskFailure = createAction('CANCEL_TASK_FAILURE');

export const assignTaskRequest = createAction('ASSIGN_TASK_REQUEST');
export const assignTaskSuccess = createAction('ASSIGN_TASK_SUCCESS');
export const assignTaskFailure = createAction('ASSIGN_TASK_FAILURE');

export const updateTaskSuccess = createFsAction(UPDATE_TASK_SUCCESS);

export const bulkAssignmentTasksRequest = createAction(
  'BULK_ASSIGNMENT_TASKS_REQUEST',
);
export const bulkAssignmentTasksSuccess = createAction(
  'BULK_ASSIGNMENT_TASKS_SUCCESS',
);
export const bulkAssignmentTasksFailure = createAction(
  'BULK_ASSIGNMENT_TASKS_FAILURE',
);

export const unassignTaskRequest = createAction('UNASSIGN_TASK_REQUEST');
export const unassignTaskSuccess = createAction('UNASSIGN_TASK_SUCCESS');
export const unassignTaskFailure = createAction('UNASSIGN_TASK_FAILURE');

export const createTourSuccess = createFsAction(CREATE_TOUR_SUCCESS);

export const updateTourSuccess = createFsAction(UPDATE_TOUR_SUCCESS);

export const changeDate = createAction('CHANGE_DATE');
export const initialized = createAction('DISPATCH_INITIALIZE');


function showAlert(e) {
  let message = i18n.t('TRY_LATER');

  if (e.hasOwnProperty('hydra:description')) {
    message = e['hydra:description'];
  }

  Alert.alert(
    i18n.t('FAILED'),
    message,
    [
      {
        text: 'OK',
        onPress: () => {},
      },
    ],
    { cancelable: false },
  );
}

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

        if (isSameDateTask(t, date)) {
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

export function assignTask(task, username) {
  return function (dispatch, getState) {
    const state = getState();
    const httpClient = state.app.httpClient;

    const linkedTasks = withUnassignedLinkedTasks(task, selectAllTasks(getState()));
    selectToursTasksIndex(getState());

    if (linkedTasks.length > 1) {
      // Multiple task assignment => Just use bulk assignment!
      return bulkAssignmentTasks(linkedTasks, username)(dispatch, getState);
    }

    // Single task assignment
    dispatch(assignTaskRequest());

    return httpClient
      .put(`${task['@id']}/assign`, { username })
      .then(res => {
        return maybeUpdateTourTasks(state, [task['@id']])
          .then(_res => dispatch(assignTaskSuccess(res)));
      })
      .catch(e => dispatch(assignTaskFailure(e)));
  };
}

/**
 * Assign several tasks at once (and add the linked tasks)
 * @param {Array.Objects} tasks - Tasks to be assigned
 * @param {string} username - Username of the rider to which we assign
 *
 */
export function bulkAssignmentTasks(tasks, username) {
  return function (dispatch, getState) {
    const state = getState();
    const httpClient = state.app.httpClient;

    dispatch(bulkAssignmentTasksRequest());

    let tasksToAssign = [];

    tasks.forEach((task) => {
      tasksToAssign.push(...withUnassignedLinkedTasks(task, selectAllTasks(getState())))
    });

    const taskIdsToAssign = _.uniq(tasksToAssign.map(t => t['@id']));

    return httpClient
      .put('/api/tasks/assign', {
        username,
        tasks: taskIdsToAssign
      })
      .then(res => {
        return maybeUpdateTourTasks(state, taskIdsToAssign)
          .then(_res => dispatch(bulkAssignmentTasksSuccess(res['hydra:member'])));
      })
      .catch(e => dispatch(bulkAssignmentTasksFailure(e)));
  };
}

function maybeUpdateTourTasks(state, taskIdsToAssign) {
  const index = selectToursTasksIndex(state);
  // TODO / WIP..!
  console.log("TOURS/TASKS TO ASSIGN: ", taskIdsToAssign);
  console.log("TOURS/TASKS INDEX: ", JSON.stringify(index, null, 2));
  //useUpdateTourMutation
  return Promise.all([]);
}

export function unassignTask(task, username) {
  return function (dispatch, getState) {
    const httpClient = getState().app.httpClient;

    dispatch(unassignTaskRequest());

    const tasks = withAssignedLinkedTasks(task, selectAllTasks(getState()))

    tasks.forEach(t => {
      return httpClient
      .put(`${t['@id']}/unassign`, { username })
      .then(res => dispatch(unassignTaskSuccess(res)))
      .catch(e => dispatch(unassignTaskFailure(e)))
    })
  };
}

export function updateTask(action, task) {
  return function (dispatch, getState) {
    let date = selectSelectedDate(getState());

    if (isSameDateTask(task, date)) {
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

    if (isSameDateTaskList(taskList, date)) {
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

    if (isSameDateTour(tour, date)) {
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
