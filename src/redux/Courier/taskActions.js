import { Alert } from 'react-native'
import { createAction } from 'redux-actions'
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'

import NavigationHolder from '../../NavigationHolder'
import i18n from '../../i18n'
import { selectPictures, selectSignatures } from './taskSelectors'
import tracker from '../../analytics/Tracker'
import analyticsEvent from '../../analytics/Event'

/*
 * Action Types
 */
export const LOAD_TASKS_REQUEST = 'LOAD_TASKS_REQUEST'
export const LOAD_TASKS_SUCCESS = 'LOAD_TASKS_SUCCESS'
export const LOAD_TASKS_FAILURE = 'LOAD_TASKS_FAILURE'
export const MARK_TASK_DONE_REQUEST = 'MARK_TASK_DONE_REQUEST'
export const MARK_TASK_DONE_SUCCESS = 'MARK_TASK_DONE_SUCCESS'
export const MARK_TASK_DONE_FAILURE = 'MARK_TASK_DONE_FAILURE'
export const MARK_TASKS_DONE_REQUEST = 'MARK_TASKS_DONE_REQUEST'
export const MARK_TASKS_DONE_SUCCESS = 'MARK_TASKS_DONE_SUCCESS'
export const MARK_TASKS_DONE_FAILURE = 'MARK_TASKS_DONE_FAILURE'
export const MARK_TASK_FAILED_REQUEST = 'MARK_TASK_FAILED_REQUEST'
export const MARK_TASK_FAILED_SUCCESS = 'MARK_TASK_FAILED_SUCCESS'
export const MARK_TASK_FAILED_FAILURE = 'MARK_TASK_FAILED_FAILURE'
export const START_TASK_REQUEST = 'START_TASK_REQUEST'
export const START_TASK_SUCCESS = 'START_TASK_SUCCESS'
export const START_TASK_FAILURE = 'START_TASK_FAILURE'

export const ADD_PICTURE = 'ADD_PICTURE'
export const ADD_SIGNATURE = 'ADD_SIGNATURE'
export const CLEAR_FILES = 'CLEAR_FILES'
export const DELETE_SIGNATURE = 'DELETE_SIGNATURE'
export const DELETE_PICTURE = 'DELETE_PICTURE'

export const ADD_TASK_FILTER = 'ADD_TASK_FILTER'
export const CLEAR_TASK_FILTER = 'CLEAR_TASK_FILTER'
export const SET_TASK_FILTER = 'SET_TASK_FILTER'
export const SET_TASKS_CHANGED_ALERT_SOUND = 'SET_TASKS_CHANGED_ALERT_SOUND'
export const SET_KEEP_AWAKE = 'SET_KEEP_AWAKE'
export const SET_SIGNATURE_SCREEN_FIRST = 'SET_SIGNATURE_SCREEN_FIRST'

/*
 * Action Creators
 */
export const loadTasksRequest = createAction(LOAD_TASKS_REQUEST, (date, refresh = false) => ({ date, refresh }))
export const loadTasksSuccess = createAction(LOAD_TASKS_SUCCESS, (date, items, updatedAt) => ({ date, items, updatedAt }))
export const loadTasksFailure = createAction(LOAD_TASKS_FAILURE)
export const markTaskDoneRequest = createAction(MARK_TASK_DONE_REQUEST)
export const markTaskDoneSuccess = createAction(MARK_TASK_DONE_SUCCESS)
export const markTaskDoneFailure = createAction(MARK_TASK_DONE_FAILURE)
export const markTasksDoneRequest = createAction(MARK_TASKS_DONE_REQUEST)
export const markTasksDoneSuccess = createAction(MARK_TASKS_DONE_SUCCESS)
export const markTasksDoneFailure = createAction(MARK_TASKS_DONE_FAILURE)
export const markTaskFailedRequest = createAction(MARK_TASK_FAILED_REQUEST)
export const markTaskFailedSuccess = createAction(MARK_TASK_FAILED_SUCCESS)
export const markTaskFailedFailure = createAction(MARK_TASK_FAILED_FAILURE)
export const startTaskRequest = createAction(START_TASK_REQUEST)
export const startTaskSuccess = createAction(START_TASK_SUCCESS)
export const startTaskFailure = createAction(START_TASK_FAILURE)

export const addPicture = createAction(ADD_PICTURE, (task, base64) => ({ task, base64 }))
export const addSignature = createAction(ADD_SIGNATURE, (task, base64) => ({ task, base64 }))
export const clearFiles = createAction(CLEAR_FILES)
export const deleteSignatureAt = createAction(DELETE_SIGNATURE)
export const deletePictureAt = createAction(DELETE_PICTURE)

export const filterTasks = createAction(ADD_TASK_FILTER)
export const clearTasksFilter = createAction(CLEAR_TASK_FILTER)
export const setTasksFilter = createAction(SET_TASK_FILTER)
const _setTasksChangedAlertSound = createAction(SET_TASKS_CHANGED_ALERT_SOUND)
export const setSignatureScreenFirst = createAction(SET_SIGNATURE_SCREEN_FIRST)
export const setKeepAwake = createAction(SET_KEEP_AWAKE)

/**
 * Side-effects
 */

function showAlert(e) {

  let message = i18n.t('AN_ERROR_OCCURRED')

  if (e) {
    if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data['hydra:description']) {
      message = e.response.data['hydra:description']
    } else if (e.hasOwnProperty('message')) {
      message = e.message
    }
  }

  Alert.alert(
    i18n.t('FAILED_TASK_COMPLETE'),
    message,
    [
      {
        text: 'OK',
        onPress: () => NavigationHolder.goBack(),
      },
    ],
    { cancelable: false }
  )
}

function showAlertAfterBulk(messages) {

  let message = i18n.t('AN_ERROR_OCCURRED')

  if (messages.length) {
    messages.forEach((m, index) => {
      if (index === 0) {
        message = m
      } else {
        message += `\n\n${m}`
      }
    })
  }

  Alert.alert(
    i18n.t('FAILED_TASK_COMPLETE'),
    message,
    [
      {
        text: 'OK',
        onPress: () => {},
      },
    ],
    { cancelable: false }
  )
}

/**
 * Thunk Creators
 */

export function loadTasks(selectedDate, refresh = false) {

  return function (dispatch, getState) {

    const { httpClient } = getState().app

    dispatch(loadTasksRequest(selectedDate, refresh))

    return httpClient.get('/api/me/tasks/' + selectedDate.format('YYYY-MM-DD'))
      .then(res => {
        if (Object.prototype.hasOwnProperty.call(res, '@type') && res['@type'] === 'TaskList') {
          dispatch(loadTasksSuccess(
            selectedDate.format('YYYY-MM-DD'),
            res.items,
            moment.parseZone(res.updatedAt)
          ))
        } else {
          // Legacy
          dispatch(loadTasksSuccess(
            selectedDate.format('YYYY-MM-DD'),
            res['hydra:member'],
            moment()
          ))
        }
      })
      .catch(e => dispatch(loadTasksFailure(e)))
  }
}

function uploadTaskImages(task, state) {

  const signatures = selectSignatures(state)
  const pictures = selectPictures(state)

  const files = signatures.concat(pictures)

  if (!files.length) {
    return Promise.resolve()
  }

  const promises = files.map(file => uploadTaskImage(state.app.httpClient, file, {
    headers: {
      'X-Attach-To': task['@id'],
    },
  }))

  return Promise.all(promises)
}

function uploadTasksImages(tasks, state) {

  const signatures = selectSignatures(state)
  const pictures = selectPictures(state)

  const files = signatures.concat(pictures)

  if (!files.length) {
    return Promise.resolve()
  }

  const promises = files.map(file => uploadTaskImage(state.app.httpClient, file, {
    headers: {
      'X-Attach-To': tasks.map(task => task['@id']).join(';'),
    },
  }))

  return Promise.all(promises)
}

export function markTaskFailed(httpClient, task, notes = '', onSuccess, contactName = '') {

  return function (dispatch, getState) {

    dispatch(markTaskFailedRequest(task))

    let payload = {
      notes,
    }

    if (!_.isEmpty(contactName)) {
      payload = {
        ...payload,
        contactName,
      }
    }

    // Make sure to return a promise for testing
    return uploadTaskImages(task, getState())
      .then(uploadTasks => {
        return httpClient
          .put(task['@id'] + '/failed', payload)
          .then(savedTask => {
            httpClient.execUploadTask(uploadTasks)
            dispatch(clearFiles())
            dispatch(markTaskFailedSuccess(savedTask))
            if (typeof onSuccess === 'function') {
              setTimeout(() => onSuccess(), 100)
            }
          })
      })
      .catch(e => {
        dispatch(markTaskFailedFailure(e))
        setTimeout(() => showAlert(e), 100)
      })
  }
}

export function markTaskDone(httpClient, task, notes = '', onSuccess, contactName = '') {

  return function (dispatch, getState) {

    dispatch(markTaskDoneRequest(task))

    let payload = {
      notes,
    }

    if (!_.isEmpty(contactName)) {
      payload = {
        ...payload,
        contactName,
      }
    }

    // Make sure to return a promise for testing
    return uploadTaskImages(task, getState())
      .then(uploadTasks => {
        return httpClient
          .put(task['@id'] + '/done', payload)
          .then(savedTask => {
            httpClient.execUploadTask(uploadTasks)
            dispatch(clearFiles())
            dispatch(markTaskDoneSuccess(savedTask))
            if (typeof onSuccess === 'function') {
              setTimeout(() => onSuccess(), 100)
            }
          })
      })
      .catch(e => {
        dispatch(markTaskDoneFailure(e))
        setTimeout(() => showAlert(e), 100)
      })
  }
}

export function markTasksDone(httpClient, tasks, notes = '', onSuccess, contactName = '') {

  return function (dispatch, getState) {

    dispatch(markTasksDoneRequest())

    let payload = {
      tasks: tasks.map(t => t['@id']),
      notes,
    }

    if (!_.isEmpty(contactName)) {
      payload = {
        ...payload,
        contactName,
      }
    }

    return uploadTasksImages(tasks, getState())
      .then(uploadTasks => {
        return httpClient.put('/api/tasks/done', payload)
          .then(res => {
            if (res['failed'] && Object.keys(res['failed']).length) {
              showAlertAfterBulk(Object.values(res['failed']))
              if (!res['success'] || !res['success'].length) {
                dispatch(markTasksDoneFailure())
              }
            }
            if (res['success'] && res['success'].length) {
              httpClient.execUploadTask(uploadTasks)
              dispatch(clearFiles())
              dispatch(markTasksDoneSuccess(res['success']))
              if (typeof onSuccess === 'function') {
                setTimeout(() => onSuccess(), 100)
              }
            }
          })
      })
      .catch(e => {
        dispatch(markTasksDoneFailure(e))
        setTimeout(() => showAlert(e), 100)
      })
  }
}

export function startTask(task, cb) {

  return function (dispatch, getState) {

    dispatch(startTaskRequest(task))

    const httpClient = getState().app.httpClient

    httpClient
      .put(task['@id'] + '/start', {})
      .then(savedTask => {
        dispatch(startTaskSuccess(task))
        if (typeof cb === 'function') {
          setTimeout(() => cb(), 100)
        }
      })
      .catch(e => dispatch(startTaskFailure(e)))
  }
}

function uploadTaskImage(httpClient, file, options) {
  return httpClient.uploadFileAsync('/api/task_images', file, options)
}

export function setTasksChangedAlertSound(enabled) {
  return (dispatch, getState) => {
    dispatch(_setTasksChangedAlertSound(enabled))
    tracker.logEvent(
      analyticsEvent.courier._category,
      analyticsEvent.courier.tasksChangedAlertSound,
      null,
      enabled ? 1 : 0)
  }
}
