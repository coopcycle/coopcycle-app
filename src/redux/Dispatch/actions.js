import _ from 'lodash';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { createAction } from '@reduxjs/toolkit';

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

export const createTaskRequest = createAction('@dispatch/CREATE_TASK_REQUEST');
export const createTaskSuccess = createAction('@dispatch/CREATE_TASK_SUCCESS');
export const createTaskFailure = createAction('@dispatch/CREATE_TASK_FAILURE');

export const cancelTaskRequest = createAction('@dispatch/CANCEL_TASK_REQUEST');
export const cancelTaskSuccess = createAction('@dispatch/CANCEL_TASK_SUCCESS');
export const cancelTaskFailure = createAction('@dispatch/CANCEL_TASK_FAILURE');

export const assignTaskRequest = createAction('@dispatch/ASSIGN_TASK_REQUEST');
export const assignTaskSuccess = createAction(DEP_ASSIGN_TASK_SUCCESS);
export const assignTaskFailure = createAction('@dispatch/ASSIGN_TASK_FAILURE');

export const updateTaskSuccess = createAction(DEP_UPDATE_TASK_SUCCESS);

export const bulkAssignmentTasksRequest = createAction(
  '@dispatch/BULK_ASSIGNMENT_TASKS_REQUEST',
);
export const bulkAssignmentTasksSuccess = createAction(
  DEP_BULK_ASSIGNMENT_TASKS_SUCCESS,
);
export const bulkAssignmentTasksFailure = createAction(
  '@dispatch/BULK_ASSIGNMENT_TASKS_FAILURE',
);

export const unassignTaskRequest = createAction('@dispatch/UNASSIGN_TASK_REQUEST');
export const unassignTaskSuccess = createAction(DEP_UNASSIGN_TASK_SUCCESS);
export const unassignTaskFailure = createAction('@dispatch/UNASSIGN_TASK_FAILURE');

export const createTourSuccess = createAction('@dispatch/CREATE_TOUR_SUCCESS');

export const updateTourSuccess = createAction(DEP_UPDATE_TOUR_SUCCESS);

export const changeDate = createAction(DEP_CHANGE_DATE);
export const initialized = createAction('@dispatch/DISPATCH_INITIALIZE');


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

// DEPRECATED
export function assignTask(task, username) {
  return function (dispatch, getState) {
    const state = getState();
    const httpClient = state.app.httpClient;
    const linkedTasks = withUnassignedLinkedTasks(task, selectAllTasks(state));

    if (linkedTasks.length > 1) {
      // Multiple task assignment => Just use bulk assignment!
      return bulkAssignmentTasks(linkedTasks, username)(dispatch, getState);
    }

    // Single task assignment
    dispatch(assignTaskRequest());

    return httpClient
      .put(`${task['@id']}/assign`, { username })
      .then(res => maybeRemoveTourTasks(state, [task['@id']]).then(_ok => res))
      .then(res => dispatch(assignTaskSuccess(res)))
      .catch(e => dispatch(assignTaskFailure(e)));
  };
}

/**
 * Assign several tasks at once (and add the linked tasks)
 * @param {Array.Objects} tasks - Tasks to be assigned
 * @param {string} username - Username of the rider to which we assign
 *
 */

// DEPRECATED ???
export function bulkAssignmentTasks(tasks, username) {
  return function (dispatch, getState) {
    const state = getState();
    const httpClient = state.app.httpClient;
    const taskIdsToAssign = _.uniq(
      tasks.reduce((acc, task) => acc.concat(withUnassignedLinkedTasks(task, selectAllTasks(state))), [])
        .map(t => t['@id'])
    );

    dispatch(bulkAssignmentTasksRequest());

    return httpClient
      .put('/api/tasks/assign', {
        username,
        tasks: taskIdsToAssign
      })
      .then(res => maybeRemoveTourTasks(state, taskIdsToAssign).then(_ok => res))
      .then(res => dispatch(bulkAssignmentTasksSuccess(res['hydra:member'])))
      .catch(e => dispatch(bulkAssignmentTasksFailure(e)));
  };
}

// DEPRECATED
function maybeRemoveTourTasks(state, taskIdsToRemove) {
  const index = selectToursTasksIndex(state);
  const httpClient = state.app.httpClient;

  const toursToUpdate = taskIdsToRemove.reduce((acc, taskId) => {
    const tourId = index.tasks[taskId];
    if (tourId) {
      // Initialize with all the indexed tour tasks if not already present
      // and remove the taskId from the tour tasks
      acc[tourId] = (acc[tourId] || index.tours[tourId]).filter(tourTaskId => tourTaskId !== taskId);
    }
    return acc;
  }
  , {});

  return Promise.all(
    Object.entries(toursToUpdate).map(([tourUrl, tourTasks]) => httpClient.put(tourUrl, {
      tasks: tourTasks
    }))
  );
}

// DEPRECATED
export function unassignTask(task, username) {
  return function (dispatch, getState) {
    const state = getState();
    const httpClient = state.app.httpClient;
    const taskIdsToUnassign = withAssignedLinkedTasks(task, selectAllTasks(state)).map(t => t['@id']);
    let unassignedTaskIds = [];
    let responses = [];
    let errors = [];

    if (taskIdsToUnassign.length === 0)
      // We can have an empty list of tasks to unassign (ie. when the task is already unassigned but the tour where it belogs to is not)
      // TODO: This should be solved and removed somewhere in the near future..
      return Alert.alert(
        i18n.t('AN_ERROR_OCCURRED'),
        i18n.t('TASK_ALREADY_UNASSIGNED_SOLVE_FROM_WEB'),
        [{text: 'OK', onPress: () => {}}],
        {cancelable: false}
      );

    dispatch(unassignTaskRequest());

    // This one needs more work, it should be a "bulkUnssignmentTasks" endpoint
    // It sometimes fails when unassigning the related tasks (one response with 200, the other response with 500)
    return Promise.all(
      taskIdsToUnassign.map(taskId => {
        return httpClient.put(`${taskId}/unassign`, { username })
          .then(rs => {
            unassignedTaskIds.push(taskId);
            responses.push(rs);
          })
          // This catch below makes the Promise.all(..) to never fail
          .catch(e => errors.push(e));
      })
    )
    .then(() => {
      return maybeRemoveTourTasks(state, unassignedTaskIds)
        .finally(() => {
          if (errors.length > 0) {
            errors.forEach(e => dispatch(unassignTaskFailure(e)));
          }
          if (responses.length > 0) {
            responses.forEach(rs => dispatch(unassignTaskSuccess(rs)));
          }

          return unassignedTaskIds;
        });
    });
  }
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
