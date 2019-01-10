import { Alert } from 'react-native'
import { createAction } from 'redux-actions'

import { connect, init } from '../middlewares/WebSocketMiddleware/actions'
import WebSocketClient from '../../websocket/WebSocketClient'
import i18n from '../../i18n'

/*
 * Action Types
 */

export const DISPATCH_INITIALIZE = 'DISPATCH_INITIALIZE'

export const LOAD_UNASSIGNED_TASKS_REQUEST = 'LOAD_UNASSIGNED_TASKS_REQUEST'
export const LOAD_UNASSIGNED_TASKS_SUCCESS = 'LOAD_UNASSIGNED_TASKS_SUCCESS'
export const LOAD_UNASSIGNED_TASKS_FAILURE = 'LOAD_UNASSIGNED_TASKS_FAILURE'

export const DISPATCH_LOAD_TASKS_REQUEST = 'DISPATCH_LOAD_TASKS_REQUEST'
export const DISPATCH_LOAD_TASKS_SUCCESS = 'DISPATCH_LOAD_TASKS_SUCCESS'
export const DISPATCH_LOAD_TASKS_FAILURE = 'DISPATCH_LOAD_TASKS_FAILURE'

export const LOAD_USERS_REQUEST = 'LOAD_USERS_REQUEST'
export const LOAD_USERS_SUCCESS = 'LOAD_USERS_SUCCESS'
export const LOAD_USERS_FAILURE = 'LOAD_USERS_FAILURE'

export const LOAD_TASK_LISTS_REQUEST = 'LOAD_TASK_LISTS_REQUEST'
export const LOAD_TASK_LISTS_SUCCESS = 'LOAD_TASK_LISTS_SUCCESS'
export const LOAD_TASK_LISTS_FAILURE = 'LOAD_TASK_LISTS_FAILURE'

export const CREATE_TASK_LIST_REQUEST = 'CREATE_TASK_LIST_REQUEST'
export const CREATE_TASK_LIST_SUCCESS = 'CREATE_TASK_LIST_SUCCESS'
export const CREATE_TASK_LIST_FAILURE = 'CREATE_TASK_LIST_FAILURE'

export const CREATE_TASK_REQUEST = 'CREATE_TASK_REQUEST'
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS'
export const CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE'

export const ASSIGN_TASK_REQUEST = 'ASSIGN_TASK_REQUEST'
export const ASSIGN_TASK_SUCCESS = 'ASSIGN_TASK_SUCCESS'
export const ASSIGN_TASK_FAILURE = 'ASSIGN_TASK_FAILURE'

export const UNASSIGN_TASK_REQUEST = 'UNASSIGN_TASK_REQUEST'
export const UNASSIGN_TASK_SUCCESS = 'UNASSIGN_TASK_SUCCESS'
export const UNASSIGN_TASK_FAILURE = 'UNASSIGN_TASK_FAILURE'

export const LOAD_TASK_REQUEST = 'LOAD_TASK_REQUEST'
export const LOAD_TASK_SUCCESS = 'LOAD_TASK_SUCCESS'
export const LOAD_TASK_FAILURE = 'LOAD_TASK_FAILURE'

export const CHANGE_DATE = 'CHANGE_DATE'

/*
 * Action Creators
 */

export const loadUnassignedTasksRequest = createAction(LOAD_UNASSIGNED_TASKS_REQUEST)
export const loadUnassignedTasksSuccess = createAction(LOAD_UNASSIGNED_TASKS_SUCCESS)
export const loadUnassignedTasksFailure = createAction(LOAD_UNASSIGNED_TASKS_FAILURE)

export const loadTasksRequest = createAction(DISPATCH_LOAD_TASKS_REQUEST)
export const loadTasksSuccess = createAction(DISPATCH_LOAD_TASKS_SUCCESS)
export const loadTasksFailure = createAction(DISPATCH_LOAD_TASKS_FAILURE)

export const loadUsersRequest = createAction(LOAD_USERS_REQUEST)
export const loadUsersSuccess = createAction(LOAD_USERS_SUCCESS)
export const loadUsersFailure = createAction(LOAD_USERS_FAILURE)

export const loadTaskListsRequest = createAction(LOAD_TASK_LISTS_REQUEST)
export const loadTaskListsSuccess = createAction(LOAD_TASK_LISTS_SUCCESS)
export const loadTaskListsFailure = createAction(LOAD_TASK_LISTS_FAILURE)

export const createTaskListRequest = createAction(CREATE_TASK_LIST_REQUEST)
export const createTaskListSuccess = createAction(CREATE_TASK_LIST_SUCCESS)
export const createTaskListFailure = createAction(CREATE_TASK_LIST_FAILURE)

export const createTaskRequest = createAction(CREATE_TASK_REQUEST)
export const createTaskSuccess = createAction(CREATE_TASK_SUCCESS)
export const createTaskFailure = createAction(CREATE_TASK_FAILURE)

export const assignTaskRequest = createAction(ASSIGN_TASK_REQUEST)
export const assignTaskSuccess = createAction(ASSIGN_TASK_SUCCESS)
export const assignTaskFailure = createAction(ASSIGN_TASK_FAILURE)

export const unassignTaskRequest = createAction(UNASSIGN_TASK_REQUEST)
export const unassignTaskSuccess = createAction(UNASSIGN_TASK_SUCCESS)
export const unassignTaskFailure = createAction(UNASSIGN_TASK_FAILURE)

export const loadTaskRequest = createAction(LOAD_TASK_REQUEST)
export const loadTaskSuccess = createAction(LOAD_TASK_SUCCESS)
export const loadTaskFailure = createAction(LOAD_TASK_FAILURE)

const _changeDate = createAction(CHANGE_DATE)
const _initialize = createAction(DISPATCH_INITIALIZE)

/**
 * Thunk Creators
 */

function _loadUsers(httpClient) {

  return httpClient.get('/api/users?roles[]=ROLE_COURIER')
}

function _loadUnassignedTasks(httpClient, date) {

  return httpClient.get(`/api/tasks?date=${date.format('YYYY-MM-DD')}&assigned=no`)
}

function _loadTaskLists(httpClient, date) {

  return httpClient.get(`/api/task_lists?date=${date.format('YYYY-MM-DD')}`)
}

function _loadAll(httpClient, date) {

  return Promise.all([
    _loadUsers(httpClient),
    _loadUnassignedTasks(httpClient, date),
    _loadTaskLists(httpClient, date)
  ])
}

function _loadTasks(httpClient, date) {

  return Promise.all([
    _loadUnassignedTasks(httpClient, date),
    _loadTaskLists(httpClient, date)
  ])
}

function showAlert(e) {
  let message = i18n.t('TRY_LATER')

  if (e.hasOwnProperty('hydra:description')) {
    message = e['hydra:description']
  }

  Alert.alert(
    i18n.t('FAILED'),
    message,
    [
      {
        text: 'OK',
        onPress: () => {}
      },
    ],
    { cancelable: false }
  )
}

export function initialize() {

  return function (dispatch, getState) {

    const initialized = getState().dispatch.initialized

    if (initialized) {

      return
    }

    const httpClient = getState().app.httpClient
    const date = getState().dispatch.date

    dispatch(loadUnassignedTasksRequest())

    _loadAll(httpClient, date)
      .then(values => {
        const [ users, unassignedTasks, taskLists ] = values
        dispatch(loadUsersSuccess(users['hydra:member']))
        dispatch(loadUnassignedTasksSuccess(unassignedTasks['hydra:member']))
        dispatch(loadTaskListsSuccess(taskLists['hydra:member']))
        dispatch(init(new WebSocketClient(httpClient, '/dispatch')))
        dispatch(connect())
        dispatch(_initialize())
      })
      .catch(e => dispatch(loadTasksFailure(e)))
  }
}

export function changeDate(date) {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(loadUnassignedTasksRequest())

    _loadTasks(httpClient, date)
      .then(values => {
        const [ unassignedTasks, taskLists ] = values
        dispatch(loadUnassignedTasksSuccess(unassignedTasks['hydra:member']))
        dispatch(loadTaskListsSuccess(taskLists['hydra:member']))
      })
      .catch(e => dispatch(loadTasksFailure(e)))

    dispatch(_changeDate(date))
  }
}

export function loadUsers() {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(loadUsersRequest())

    return httpClient.get('/api/users?roles[]=ROLE_COURIER')
      .then(res => dispatch(loadUsersSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadUsersFailure(e)))
  }
}

export function loadTaskLists(date) {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(loadTaskListsRequest())

    return httpClient.get(`/api/task_lists?date=${date.format('YYYY-MM-DD')}`)
      .then(res => dispatch(loadTaskListsSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadTaskListsFailure(e)))
  }
}

export function createTaskList(date, user) {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(createTaskListRequest())

    return httpClient.post('/api/task_lists', { date: date.format('YYYY-MM-DD'), courier: user['@id'] })
      .then(res => dispatch(createTaskListSuccess(res)))
      .catch(e => dispatch(createTaskListFailure(e)))
  }
}

export function createTask(task) {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(createTaskRequest())

    return httpClient.post('/api/tasks', task)
      .then(res => dispatch(createTaskSuccess(res)))
      .catch(e => {
        dispatch(createTaskFailure(e))
        setTimeout(() => showAlert(e), 100)
      })
  }
}

export function assignTask(task, username) {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(assignTaskRequest())

    return httpClient.put(`${task['@id']}/assign`, { username })
      .then(res => dispatch(assignTaskSuccess(res)))
      .catch(e => dispatch(assignTaskFailure(e)))
  }
}

export function unassignTask(task, username) {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(unassignTaskRequest())

    return httpClient.put(`${task['@id']}/unassign`, { username })
      .then(res => dispatch(unassignTaskSuccess(res)))
      .catch(e => dispatch(unassignTaskFailure(e)))
  }
}

export function loadTask(task) {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    // dispatch(loadTaskRequest())

    return httpClient.get(task)
      .then(res => dispatch(loadTaskSuccess(res)))
      .catch(e => dispatch(loadTaskFailure(e)))
  }
}
