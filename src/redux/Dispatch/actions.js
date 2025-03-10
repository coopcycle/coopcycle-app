import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { createAction } from 'redux-actions';

import _ from 'lodash';
import NavigationHolder from '../../NavigationHolder';
import i18n from '../../i18n';
import { connectCentrifugo } from '../middlewares/CentrifugoMiddleware/actions';

import {
  createTaskListFailure,
  createTaskListRequest,
  createTaskListSuccess,
  selectAllTasks,
  selectSelectedDate,
} from '../../coopcycle-frontend-js/logistics/redux';

import {
  markTaskDoneSuccess,
  markTaskFailedSuccess,
  startTaskSuccess,
} from '../Courier';

import { withAssignedLinkedTasks, withUnassignedLinkedTasks } from '../../shared/src/logistics/redux/taskUtils';
import { isSameDate } from './utils';

/*
 * Action Types
 */

export const DISPATCH_INITIALIZE = 'DISPATCH_INITIALIZE';

export const LOAD_UNASSIGNED_TASKS_REQUEST = 'LOAD_UNASSIGNED_TASKS_REQUEST';
export const LOAD_UNASSIGNED_TASKS_SUCCESS = 'LOAD_UNASSIGNED_TASKS_SUCCESS';
export const LOAD_UNASSIGNED_TASKS_FAILURE = 'LOAD_UNASSIGNED_TASKS_FAILURE';

export const LOAD_USERS_REQUEST = 'LOAD_USERS_REQUEST';
export const LOAD_USERS_SUCCESS = 'LOAD_USERS_SUCCESS';
export const LOAD_USERS_FAILURE = 'LOAD_USERS_FAILURE';

export const LOAD_TASK_LISTS_REQUEST = 'LOAD_TASK_LISTS_REQUEST';
export const LOAD_TASK_LISTS_SUCCESS = 'LOAD_TASK_LISTS_SUCCESS';
export const LOAD_TASK_LISTS_FAILURE = 'LOAD_TASK_LISTS_FAILURE';

export const CREATE_TASK_REQUEST = 'CREATE_TASK_REQUEST';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE';

export const CANCEL_TASK_REQUEST = 'CANCEL_TASK_REQUEST';
export const CANCEL_TASK_SUCCESS = 'CANCEL_TASK_SUCCESS';
export const CANCEL_TASK_FAILURE = 'CANCEL_TASK_FAILURE';

export const ASSIGN_TASK_REQUEST = 'ASSIGN_TASK_REQUEST';
export const ASSIGN_TASK_SUCCESS = 'ASSIGN_TASK_SUCCESS';
export const ASSIGN_TASK_FAILURE = 'ASSIGN_TASK_FAILURE';

export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';

export const BULK_ASSIGNMENT_TASKS_REQUEST = 'BULK_ASSIGNMENT_TASKS_REQUEST';
export const BULK_ASSIGNMENT_TASKS_SUCCESS = 'BULK_ASSIGNMENT_TASKS_SUCCESS';
export const BULK_ASSIGNMENT_TASKS_FAILURE = 'BULK_ASSIGNMENT_TASKS_FAILURE';

export const UNASSIGN_TASK_REQUEST = 'UNASSIGN_TASK_REQUEST';
export const UNASSIGN_TASK_SUCCESS = 'UNASSIGN_TASK_SUCCESS';
export const UNASSIGN_TASK_FAILURE = 'UNASSIGN_TASK_FAILURE';

export const CHANGE_DATE = 'CHANGE_DATE';

/*
 * Action Creators
 */

export const loadUnassignedTasksRequest = createAction(
  LOAD_UNASSIGNED_TASKS_REQUEST,
);
export const loadUnassignedTasksSuccess = createAction(
  LOAD_UNASSIGNED_TASKS_SUCCESS,
);
export const loadUnassignedTasksFailure = createAction(
  LOAD_UNASSIGNED_TASKS_FAILURE,
);

export const loadUsersRequest = createAction(LOAD_USERS_REQUEST);
export const loadUsersSuccess = createAction(LOAD_USERS_SUCCESS);
export const loadUsersFailure = createAction(LOAD_USERS_FAILURE);

export const loadTaskListsRequest = createAction(LOAD_TASK_LISTS_REQUEST);
export const loadTaskListsSuccess = createAction(LOAD_TASK_LISTS_SUCCESS);
export const loadTaskListsFailure = createAction(LOAD_TASK_LISTS_FAILURE);

export const createTaskRequest = createAction(CREATE_TASK_REQUEST);
export const createTaskSuccess = createAction(CREATE_TASK_SUCCESS);
export const createTaskFailure = createAction(CREATE_TASK_FAILURE);

export const cancelTaskRequest = createAction(CANCEL_TASK_REQUEST);
export const cancelTaskSuccess = createAction(CANCEL_TASK_SUCCESS);
export const cancelTaskFailure = createAction(CANCEL_TASK_FAILURE);

export const assignTaskRequest = createAction(ASSIGN_TASK_REQUEST);
export const assignTaskSuccess = createAction(ASSIGN_TASK_SUCCESS);
export const assignTaskFailure = createAction(ASSIGN_TASK_FAILURE);

export const updateTaskSuccess = createAction(UPDATE_TASK_SUCCESS);

export const bulkAssignmentTasksRequest = createAction(
  BULK_ASSIGNMENT_TASKS_REQUEST,
);
export const bulkAssignmentTasksSuccess = createAction(
  BULK_ASSIGNMENT_TASKS_SUCCESS,
);
export const bulkAssignmentTasksFailure = createAction(
  BULK_ASSIGNMENT_TASKS_FAILURE,
);

export const unassignTaskRequest = createAction(UNASSIGN_TASK_REQUEST);
export const unassignTaskSuccess = createAction(UNASSIGN_TASK_SUCCESS);
export const unassignTaskFailure = createAction(UNASSIGN_TASK_FAILURE);

const _changeDate = createAction(CHANGE_DATE);
const _initialize = createAction(DISPATCH_INITIALIZE);

/**
 * Thunk Creators
 */

function _loadUsers(httpClient) {
  return httpClient.get('/api/users?roles[]=ROLE_COURIER');
}

function _loadUnassignedTasks(httpClient, date) {
  return httpClient.get(
    `/api/tasks?date=${date.format('YYYY-MM-DD')}&assigned=no`,
  );
}

function _loadTaskLists(httpClient, date) {
  return httpClient.get(`/api/task_lists?date=${date.format('YYYY-MM-DD')}`);
}

function _loadAll(httpClient, date) {
  return Promise.all([
    _loadUsers(httpClient),
    _loadUnassignedTasks(httpClient, date),
    _loadTaskLists(httpClient, date),
  ]);
}

function _loadTasks(httpClient, date) {
  return Promise.all([
    _loadUnassignedTasks(httpClient, date),
    _loadTaskLists(httpClient, date),
  ]);
}

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
    const initialized = getState().dispatch.initialized;

    if (initialized) {
      return;
    }

    const httpClient = getState().app.httpClient;
    const date = selectSelectedDate(getState());

    dispatch(loadUnassignedTasksRequest());

    _loadAll(httpClient, date)
      .then(values => {
        const [users, unassignedTasks, taskLists] = values;
        dispatch(loadUsersSuccess(users['hydra:member']));
        dispatch(loadUnassignedTasksSuccess(unassignedTasks['hydra:member']));
        dispatch(loadTaskListsSuccess(taskLists['hydra:member']));
        dispatch(connectCentrifugo());
        dispatch(_initialize());
      })
      .catch(e => {
        dispatch(loadUnassignedTasksFailure(e));
      });
  };
}

export function loadUnassignedTasks() {
  return function (dispatch, getState) {
    const httpClient = getState().app.httpClient;
    const date = selectSelectedDate(getState());

    dispatch(loadUnassignedTasksRequest());

    _loadUnassignedTasks(httpClient, date)
      .then(res => dispatch(loadUnassignedTasksSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadUnassignedTasksFailure(e)));
  };
}

export function changeDate(date) {
  return function (dispatch, getState) {
    const httpClient = getState().app.httpClient;

    dispatch(loadUnassignedTasksRequest());

    _loadTasks(httpClient, date)
      .then(values => {
        const [unassignedTasks, taskLists] = values;
        dispatch(loadUnassignedTasksSuccess(unassignedTasks['hydra:member']));
        dispatch(loadTaskListsSuccess(taskLists['hydra:member']));
      })
      .catch(e => dispatch(loadUnassignedTasksFailure(e)));

    dispatch(_changeDate(date));
  };
}

export function loadUsers() {
  return function (dispatch, getState) {
    const httpClient = getState().app.httpClient;

    dispatch(loadUsersRequest());

    return httpClient
      .get('/api/users?roles[]=ROLE_COURIER')
      .then(res => dispatch(loadUsersSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadUsersFailure(e)));
  };
}

export function loadTaskLists(date) {
  return function (dispatch, getState) {
    const httpClient = getState().app.httpClient;

    dispatch(loadTaskListsRequest());

    return httpClient
      .get(`/api/task_lists?date=${date.format('YYYY-MM-DD')}`)
      .then(res => dispatch(loadTaskListsSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadTaskListsFailure(e)));
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

        if (isSameDate(t, date)) {
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
    const httpClient = getState().app.httpClient;

    const linkedTasks = withUnassignedLinkedTasks(task, selectAllTasks(getState()));

    if (linkedTasks.length > 1) {
      dispatch(bulkAssignmentTasksRequest());

      return httpClient
        .put('/api/tasks/assign', {
          username,
          tasks: linkedTasks.map(t => t['@id']),
        })
        .then(res => {
          dispatch(bulkAssignmentTasksSuccess(res['hydra:member']));
        })
        .catch(e => {
          dispatch(bulkAssignmentTasksFailure(e));
        });
    } else {
      dispatch(assignTaskRequest());

      return httpClient
        .put(`${task['@id']}/assign`, { username })
        .then(res => dispatch(assignTaskSuccess(res)))
        .catch(e => dispatch(assignTaskFailure(e)));
    }
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
    const httpClient = getState().app.httpClient;

    dispatch(bulkAssignmentTasksRequest());

    let tasksToAssign = [];

    tasks.forEach((task) => {
      tasksToAssign.push(...withUnassignedLinkedTasks(task, selectAllTasks(getState())))
    });

    const payload = _.uniq(tasksToAssign.map(t => t['@id']));

    return httpClient
      .put('/api/tasks/assign', {
        username,
        tasks: payload,
      })
      .then(res => dispatch(bulkAssignmentTasksSuccess(res['hydra:member'])))
      .catch(e => dispatch(bulkAssignmentTasksFailure(e)));
  };
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

    if (isSameDate(task, date)) {
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