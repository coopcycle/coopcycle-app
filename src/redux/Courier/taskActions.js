import { Alert } from 'react-native'
import { createAction } from 'redux-actions'
import { StackActions, NavigationActions } from 'react-navigation'
import RNFetchBlob from 'rn-fetch-blob'

import NavigationHolder from '../../NavigationHolder'
import DropdownHolder from '../../DropdownHolder'
import Preferences from '../../Preferences'
import i18n from '../../i18n'
import { selectSignatures, selectPictures } from './taskSelectors'

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
export const UPLOAD_FILE_REQUEST = 'UPLOAD_FILE_REQUEST'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'
export const UPLOAD_FILE_FAILURE = 'UPLOAD_FILE_FAILURE'

export const ADD_PICTURE = 'ADD_PICTURE'
export const ADD_SIGNATURE = 'ADD_SIGNATURE'
export const CLEAR_FILES = 'CLEAR_FILES'
export const DELETE_SIGNATURE = 'DELETE_SIGNATURE'
export const DELETE_PICTURE = 'DELETE_PICTURE'

export const DONT_TRIGGER_TASKS_NOTIFICATION = 'DONT_TRIGGER_TASKS_NOTIFICATION'
export const ADD_TASK_FILTER = 'ADD_TASK_FILTER'
export const CLEAR_TASK_FILTER = 'CLEAR_TASK_FILTER'
export const SET_TASK_FILTER = 'SET_TASK_FILTER'
export const SET_KEEP_AWAKE = 'SET_KEEP_AWAKE'

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
export const uploadFileRequest = createAction(UPLOAD_FILE_REQUEST)
export const uploadFileSuccess = createAction(UPLOAD_FILE_SUCCESS, (task, taskImage) => ({ task, taskImage }))
export const uploadFileFailure = createAction(UPLOAD_FILE_FAILURE)

export const addPicture = createAction(ADD_PICTURE, (task, base64) => ({ task, base64 }))
export const addSignature = createAction(ADD_SIGNATURE, (task, base64) => ({ task, base64 }))
export const clearFiles = createAction(CLEAR_FILES)
export const deleteSignatureAt = createAction(DELETE_SIGNATURE)
export const deletePictureAt = createAction(DELETE_PICTURE)

export const dontTriggerTasksNotification = createAction(DONT_TRIGGER_TASKS_NOTIFICATION)
export const filterTasks = createAction(ADD_TASK_FILTER)
export const clearTasksFilter = createAction(CLEAR_TASK_FILTER)
export const setTasksFilter = createAction(SET_TASK_FILTER)

/**
 * Side-effects
 */

function resetNavigation() {
  // StackActions.reset() always goes to tab defined in initialRouteName
  // Call popToTop() + back() to go back properly
  NavigationHolder.dispatch(StackActions.popToTop())
  NavigationHolder.dispatch(NavigationActions.back())
}

function showAlert(e) {
  let message = i18n.t('AN_ERROR_OCCURRED')

  if (e.hasOwnProperty('hydra:description')) {
    message = e['hydra:description']
  } else if (e.hasOwnProperty('message')) {
    message = e.message
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

const _setKeepAwake = createAction(SET_KEEP_AWAKE)

export function setKeepAwake(keepAwake) {

  return function (dispatch) {
    Preferences.setKeepAwake(keepAwake)
      .then(() => dispatch(_setKeepAwake(keepAwake)))
  }
}

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
        dispatch(markTaskFailedSuccess(task))
        setTimeout(() => resetNavigation(), 100)
      })
      .catch(e => {
        dispatch(markTaskFailedFailure(e))
        setTimeout(() => showAlert(e), 100)
      })
  }
}

export function markTaskDone(httpClient, task, notes = '') {

  return function (dispatch, getState) {

    dispatch(markTaskDoneRequest(task))

    const state = getState()

    // TODO Get httpClient from store
    // const httpClient = state.app.httpClient

    const signatures = selectSignatures(state)
    const pictures = selectPictures(state)
    const files = signatures.concat(pictures)

    const promises = files.map(file => uploadTaskImage(httpClient, file))

    Promise.all(promises)
      .then(values => {
        // Associates images with task
        return httpClient.put(task['@id'], {
          images: values.map(taskImage => taskImage['@id'])
        })
      })
      .then(task => {

        return httpClient
          .put(task['@id'] + '/done', { reason: notes })
          .then(task => {
            dispatch(clearFiles())
            dispatch(markTaskDoneSuccess(task))
            setTimeout(() => resetNavigation(), 100)
          })
      })
      .catch(e => {
        dispatch(markTaskDoneFailure(e))
        setTimeout(() => showAlert(e), 100)
      })
  }
}

function uploadTaskImage(httpClient, base64) {

  // Remove line breaks from Base64 string
  const base64AsString = base64.replace(/(\r\n|\n|\r)/gm, '')

  const headers = {
    'Authorization' : `Bearer ${httpClient.getToken()}`,
    'Content-Type' : 'multipart/form-data',
  }

  const body = [{
    name : 'file',
    filename: 'filename.jpg', // This is needed to work
    data: base64AsString
  }]

  return new Promise((resolve, reject) => {

    RNFetchBlob
      .fetch('POST', httpClient.getBaseURL() + '/api/task_images', headers, body)
      // Warning: this is not a standard fetch respone
      // @see https://github.com/joltup/rn-fetch-blob/wiki/Classes#rnfetchblobresponse
      .then(fetchBlobResponse => {

        const fetchBlobResponseInfo = fetchBlobResponse.info()

        switch (fetchBlobResponseInfo.status) {
        case 400:
          return reject(fetchBlobResponse.json())
        case 201:
          return resolve(fetchBlobResponse.json())
        default:
          reject()
        }

        // TODO Manage token expired

      })
      .catch(e => reject(e))
  })

}
