import { Alert } from 'react-native'
import { createAction } from 'redux-actions'
import { StackActions, NavigationActions } from 'react-navigation'

import NavigationHolder from '../../NavigationHolder'
import i18n from '../../i18n'

/*
 * Action Types
 */
export const LOAD_TASKS_REQUEST = 'LOAD_TASKS_REQUEST'
export const LOAD_TASKS_SUCCESS = 'LOAD_TASKS_SUCCESS'
export const LOAD_TASKS_FAILURE = 'LOAD_TASKS_FAILURE'
export const MARK_TASK_DONE_REQUEST = 'MARK_TASK_DONE_REQUEST'
export const MARK_TASK_DONE_SUCCESS = 'MARK_TASK_DONE_SUCCESS'
export const MARK_TASK_DONE_FAILURE = 'MARK_TASK_DONE_FAILURE'
export const MARK_TASK_FAILED_REQUEST = 'MARK_TASK_FAILED_REQUEST'
export const MARK_TASK_FAILED_SUCCESS = 'MARK_TASK_FAILED_SUCCESS'
export const MARK_TASK_FAILED_FAILURE = 'MARK_TASK_FAILED_FAILURE'
export const DONT_TRIGGER_TASKS_NOTIFICATION = 'DONT_TRIGGER_TASKS_NOTIFICATION'
export const ADD_TASK_FILTER = 'ADD_TASK_FILTER'
export const CLEAR_TASK_FILTER = 'CLEAR_TASK_FILTER'

/*
 * Action Creators
 */
export const loadTasksRequest = createAction(LOAD_TASKS_REQUEST)
export const loadTasksSuccess = createAction(LOAD_TASKS_SUCCESS)
export const loadTasksFailure = createAction(LOAD_TASKS_FAILURE)
export const markTaskDoneRequest = createAction(MARK_TASK_DONE_REQUEST)
export const markTaskDoneSuccess = createAction(MARK_TASK_DONE_SUCCESS)
export const markTaskDoneFailure = createAction(MARK_TASK_DONE_FAILURE)
export const markTaskFailedRequest = createAction(MARK_TASK_FAILED_REQUEST)
export const markTaskFailedSuccess = createAction(MARK_TASK_FAILED_SUCCESS)
export const markTaskFailedFailure = createAction(MARK_TASK_FAILED_FAILURE)
export const dontTriggerTasksNotification = createAction(DONT_TRIGGER_TASKS_NOTIFICATION)
export const filterTasks = createAction(ADD_TASK_FILTER)
export const clearTasksFilter = createAction(CLEAR_TASK_FILTER)

/**
 * Side-effects
 */

function resetNavigation() {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
      // WARNING
      // routeName must be one of current StackNavigator
      NavigationActions.navigate({ routeName: 'Main' }),
    ]
  })
  NavigationHolder.dispatch(resetAction)
}

function showAlert(e) {
  let message = i18n.t('TRY_LATER')

  if (e.hasOwnProperty('hydra:description')) {
    message = e['hydra:description']
  }

  Alert.alert(
    i18n.t('FAILED_TASK_COMPLETE'),
    message,
    [
      {
        text: 'OK',
        onPress: () => NavigationHolder.goBack()
      },
    ],
    { cancelable: false }
  )
}


/**
 * Thunk Creators
 */

export function loadTasks(client, selectedDate) {

  return function (dispatch) {
    dispatch(loadTasksRequest(selectedDate))

    return client.get('/api/me/tasks/' + selectedDate.format('YYYY-MM-DD'))
      .then(res => dispatch(loadTasksSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadTasksFailure(e)))
  }
}

export function markTaskFailed(client, task, notes) {

  return function (dispatch) {
    dispatch(markTaskFailedRequest(task))

    return client
      .put(task['@id'] + '/failed', { reason: notes })
      .then(task => {
        resetNavigation()
        dispatch(markTaskFailedSuccess(task))
      })
      .catch(e => {
        showAlert(e)
        dispatch(markTaskFailedFailure(e))
      })
  }
}

export function markTaskDone(client, task, notes) {

  return function (dispatch) {
    dispatch(markTaskDoneRequest(task))

    return client
      .put(task['@id'] + '/done', { reason: notes })
      .then(task => {
        resetNavigation()
        dispatch(markTaskDoneSuccess(task))
      })
      .catch(e => {
        showAlert(e)
        dispatch(markTaskDoneFailure(e))
      })
  }
}
