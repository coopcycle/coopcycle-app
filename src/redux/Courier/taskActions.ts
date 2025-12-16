import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Alert } from 'react-native';
import { createAction } from 'redux-actions';

import NavigationHolder from '../../NavigationHolder';
import analyticsEvent from '../../analytics/Event';
import tracker from '../../analytics/Tracker';
import i18n from '../../i18n';
import { selectPictures, selectSignatures } from './taskSelectors';
import { selectCurrentRoute, selectHttpClient } from '../App/selectors';
import {
  cancelTaskFailure,
  cancelTaskSuccess,
  createTaskRequest,
  markTaskDoneFailure,
  markTaskDoneRequest,
  markTaskDoneSuccess,
  markTaskFailedFailure,
  markTaskFailedRequest,
  markTaskFailedSuccess,
  startTaskFailure,
  startTaskRequest,
  startTaskSuccess,
} from '../../shared/logistics/redux';
import { DateISOString } from '../../utils/date-types';
import Task from '@/src/types/task';
import { Incident } from '@/src/redux/api/types';
import { AppDispatch, RootState } from '@/src/redux/store';

/*
 * Action Types
 */
export const LOAD_TASKS_REQUEST = 'LOAD_TASKS_REQUEST';
export const LOAD_TASKS_SUCCESS = 'LOAD_TASKS_SUCCESS';
export const LOAD_TASKS_FAILURE = 'LOAD_TASKS_FAILURE';
export const MARK_TASKS_DONE_REQUEST = 'MARK_TASKS_DONE_REQUEST';
export const MARK_TASKS_DONE_SUCCESS = 'MARK_TASKS_DONE_SUCCESS';
export const MARK_TASKS_DONE_FAILURE = 'MARK_TASKS_DONE_FAILURE';
export const REPORT_INCIDENT_REQUEST = 'REPORT_INCIDENT_REQUEST';
export const REPORT_INCIDENT_SUCCESS = 'REPORT_INCIDENT_SUCCESS';
export const REPORT_INCIDENT_FAILURE = 'REPORT_INCIDENT_FAILURE';

export const ADD_PICTURE = 'ADD_PICTURE';
export const ADD_SIGNATURE = 'ADD_SIGNATURE';
export const CLEAR_FILES = 'CLEAR_FILES';
export const DELETE_SIGNATURE = 'DELETE_SIGNATURE';
export const DELETE_PICTURE = 'DELETE_PICTURE';

export const ADD_TASK_FILTER = 'ADD_TASK_FILTER';
export const CLEAR_TASK_FILTER = 'CLEAR_TASK_FILTER';
export const SET_TASK_FILTER = 'SET_TASK_FILTER';
export const SET_TASKS_CHANGED_ALERT_SOUND = 'SET_TASKS_CHANGED_ALERT_SOUND';
export const SET_KEEP_AWAKE = 'SET_KEEP_AWAKE';
export const SET_HIDE_UNASSIGNED_FROM_MAP = 'SET_HIDE_UNASSIGNED_FROM_MAP';
export const SET_POLYLINE_ON = 'SET_POLYLINE_ON';
export const SET_SIGNATURE_SCREEN_FIRST = 'SET_SIGNATURE_SCREEN_FIRST';

export const CHANGE_DATE = 'CHANGE_DATE';

/*
 * Action Creators
 */
export const loadTasksRequest = createAction(
  LOAD_TASKS_REQUEST,
  (date: DateISOString, refresh = false) => ({ date, refresh }),
);
export const loadTasksSuccess = createAction(
  LOAD_TASKS_SUCCESS,
  (date, items, updatedAt) => ({ date, items, updatedAt }),
);
export const loadTasksFailure = createAction(LOAD_TASKS_FAILURE);
export const markTasksDoneRequest = createAction(MARK_TASKS_DONE_REQUEST);
export const markTasksDoneSuccess = createAction(MARK_TASKS_DONE_SUCCESS);
export const markTasksDoneFailure = createAction(MARK_TASKS_DONE_FAILURE);
export const reportIncidentRequest = createAction(REPORT_INCIDENT_REQUEST);
export const reportIncidentSuccess = createAction(REPORT_INCIDENT_SUCCESS);
export const reportIncidentFailure = createAction(REPORT_INCIDENT_FAILURE);

export const addPicture = createAction(ADD_PICTURE, (_task, base64) => ({
  base64,
}));
export const addSignature = createAction(ADD_SIGNATURE, (_task, base64) => ({
  base64,
}));
export const clearFiles = createAction(CLEAR_FILES);
export const deleteSignatureAt = createAction(DELETE_SIGNATURE);
export const deletePictureAt = createAction(DELETE_PICTURE);

export const filterTasks = createAction(ADD_TASK_FILTER);
export const clearTasksFilter = createAction(CLEAR_TASK_FILTER);
export const setTasksFilter = createAction(SET_TASK_FILTER);
const _setTasksChangedAlertSound = createAction(SET_TASKS_CHANGED_ALERT_SOUND);
export const setSignatureScreenFirst = createAction(SET_SIGNATURE_SCREEN_FIRST);
export const setKeepAwake = createAction(SET_KEEP_AWAKE);
export const setHideUnassignedFromMap = createAction(
  SET_HIDE_UNASSIGNED_FROM_MAP,
);
export const setPolylineOn = createAction(SET_POLYLINE_ON);

export const changeDate = createAction(CHANGE_DATE);

/**
 * Side-effects
 */

function showAlert(e) {
  let message = i18n.t('AN_ERROR_OCCURRED');

  if (e) {
    if (
      axios.isAxiosError(e) &&
      e.response &&
      e.response.data &&
      e.response.data['hydra:description']
    ) {
      message = e.response.data['hydra:description'];
    } else if (e.hasOwnProperty('message')) {
      message = e.message;
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
    { cancelable: false },
  );
}

function showAlertAfterBulk(messages) {
  let message = i18n.t('AN_ERROR_OCCURRED');

  if (messages.length) {
    messages.forEach((m, index) => {
      if (index === 0) {
        message = m;
      } else {
        message += `\n\n${m}`;
      }
    });
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
    { cancelable: false },
  );
}

/**
 * Thunk Creators
 */

export function navigateAndLoadTasks(selectedDate) {
  return function (dispatch, getState) {
    const currentRoute = selectCurrentRoute(getState());

    dispatch(changeDate(selectedDate));
    dispatch(loadTasks(selectedDate));

    if (currentRoute !== 'CourierTaskList') {
      NavigationHolder.navigate('CourierTaskList', {});
    }
  };
}

export function loadTasks(
  selectedDate: moment.Moment,
  refresh = false,
  cb = null,
) {
  return function (dispatch, getState) {
    const httpClient = selectHttpClient(getState());

    dispatch(loadTasksRequest(selectedDate.toISOString(), refresh));

    return httpClient
      .get('/api/me/tasks/' + selectedDate.format('YYYY-MM-DD'))
      .then(res => {
        if (
          Object.prototype.hasOwnProperty.call(res, '@type') &&
          res['@type'] === 'TaskList'
        ) {
          dispatch(
            loadTasksSuccess(
              selectedDate.format('YYYY-MM-DD'),
              res.items,
              res.updatedAt,
            ),
          );
        } else {
          // Legacy
          dispatch(
            loadTasksSuccess(
              selectedDate.format('YYYY-MM-DD'),
              res['hydra:member'],
              moment().toISOString(),
            ),
          );
        }

        if (cb && typeof cb === 'function') {
          setTimeout(() => cb(), 0);
        }
      })
      .catch(e => {
        dispatch(loadTasksFailure(e));
        if (cb && typeof cb === 'function') {
          setTimeout(() => cb(), 0);
        }
      });
  };
}

function uploadEntityImages(entity, url, state) {
  const signatures = selectSignatures(state);
  const pictures = selectPictures(state);
  const httpClient = selectHttpClient(state);

  const files = signatures.concat(pictures);

  if (!files.length) {
    return Promise.resolve();
  }

  const promises = files.map(file =>
    httpClient.uploadFileAsync(url, file, {
      headers: {
        'X-Attach-To': entity['@id'],
      },
    }),
  );

  return Promise.all(promises);
}

function uploadEntitiesImages(entities, url, state) {
  const signatures = selectSignatures(state);
  const pictures = selectPictures(state);
  const httpClient = selectHttpClient(state);

  const files = signatures.concat(pictures);

  if (!files.length) {
    return Promise.resolve();
  }

  const promises = files.map(file =>
    httpClient.uploadFileAsync(url, file, {
      headers: {
        'X-Attach-To': entities.map(entity => entity['@id']).join(';'),
      },
    }),
  );

  return Promise.all(promises);
}

export function reportIncident(
  task,
  description = null,
  failureReasonCode = null,
  failureReasonMetadata = [],
  onSuccess,
) {
  return function (dispatch, getState) {
    const httpClient = selectHttpClient(getState());

    const payload = {
      description,
      failureReasonCode,
      metadata: failureReasonMetadata,
      task: task['@id'],
    };

    // Make sure to return a promise for testing
    return dispatch(reportIncidentFlow(task, () => {
      return httpClient.post('/api/incidents', payload);
    }, onSuccess));
  };
}

export function reportIncidentFlow(
  task: Task,
  postIncident: () => Promise<Incident>,
  onSuccess?: () => void,
  onFailure?: () => void,
) {
  return function (dispatch: AppDispatch, getState: () => RootState) {
    dispatch(reportIncidentRequest(task));

    // Make sure to return a promise for testing
    return postIncident()
      .then(incident => {
        const httpClient = selectHttpClient(getState());

        uploadEntityImages(incident, '/api/incident_images', getState()).then(
          uploadTasks => httpClient.execUploadTask(uploadTasks),
        );
        dispatch(clearFiles());
        dispatch(reportIncidentSuccess(incident));

        if (typeof onSuccess === 'function') {
          setTimeout(onSuccess, 100);
        }
      })
      .catch(e => {
        dispatch(reportIncidentFailure(e));
        setTimeout(() => {
          showAlert(e);
          if (typeof onFailure === 'function') {
            onFailure();
          }
        }, 100);
      });
  };
}

/*
 * @deprecated use reportIncident instead
 */
export function markTaskFailed(
  task,
  notes = '',
  reason = null,
  onSuccess,
  contactName = '',
) {
  return function (dispatch, getState) {
    console.warn('markTaskFailed is deprecated, use reportIncident instead');
    dispatch(markTaskFailedRequest(task));
    const httpClient = selectHttpClient(getState());

    let payload = {
      notes,
      reason,
    };

    if (!_.isEmpty(contactName)) {
      payload = {
        ...payload,
        contactName,
      };
    }

    // Make sure to return a promise for testing
    return uploadEntityImages(task, '/api/task_images', getState())
      .then(uploadTasks => {
        return httpClient
          .put(task['@id'] + '/failed', payload)
          .then(savedTask => {
            httpClient.execUploadTask(uploadTasks);
            dispatch(clearFiles());
            dispatch(markTaskFailedSuccess(savedTask));
            if (typeof onSuccess === 'function') {
              setTimeout(() => onSuccess(), 100);
            }
          });
      })
      .catch(e => {
        dispatch(markTaskFailedFailure(e));
        setTimeout(() => showAlert(e), 100);
      });
  };
}

export function markTaskDone(task, notes = '', onSuccess, contactName = '') {
  return function (dispatch, getState) {
    dispatch(markTaskDoneRequest(task));
    const httpClient = selectHttpClient(getState());

    let payload = {
      notes,
    };

    if (!_.isEmpty(contactName)) {
      payload = {
        ...payload,
        contactName,
      };
    }

    // Make sure to return a promise for testing
    return uploadEntityImages(task, '/api/task_images', getState())
      .then(uploadTasks => {
        return httpClient
          .put(task['@id'] + '/done', payload)
          .then(savedTask => {
            httpClient.execUploadTask(uploadTasks);
            dispatch(clearFiles());
            dispatch(markTaskDoneSuccess(savedTask));
            if (typeof onSuccess === 'function') {
              setTimeout(() => onSuccess(), 100);
            }
          });
      })
      .catch(e => {
        dispatch(markTaskDoneFailure());
        setTimeout(() => showAlert(e), 100);
      });
  };
}

export function markTasksDone(tasks, notes = '', onSuccess, contactName = '') {
  return function (dispatch, getState) {
    dispatch(markTasksDoneRequest());
    const httpClient = selectHttpClient(getState());

    let payload = {
      tasks: tasks.map(t => t['@id']),
      notes,
    };

    if (!_.isEmpty(contactName)) {
      payload = {
        ...payload,
        contactName,
      };
    }

    return uploadEntitiesImages(tasks, '/api/task_images', getState())
      .then(uploadTasks => {
        return httpClient.put('/api/tasks/done', payload).then(res => {
          if (res.failed && Object.keys(res.failed).length) {
            showAlertAfterBulk(Object.values(res.failed));
            if (!res.success || !res.success.length) {
              dispatch(markTasksDoneFailure());
            }
          }
          if (res.success && res.success.length) {
            httpClient.execUploadTask(uploadTasks);
            dispatch(clearFiles());
            dispatch(markTasksDoneSuccess(res.success));
            return true;
          }
        })
      })
      .then((result) => {
        if (result && typeof onSuccess === 'function') {
          setTimeout(() => onSuccess(), 100);
        }
      })
      .catch(e => {
        dispatch(markTasksDoneFailure(e));
        setTimeout(() => showAlert(e), 100);
      });
  };
}

export function startTask(task, cb) {
  return function (dispatch, getState) {
    dispatch(startTaskRequest(task));

    const httpClient = selectHttpClient(getState());

    httpClient
      .put(task['@id'] + '/start', {})
      .then(savedTask => {
        dispatch(startTaskSuccess(savedTask));
        if (typeof cb === 'function') {
          setTimeout(() => cb(), 100);
        }
      })
      .catch(e => dispatch(startTaskFailure(e)));
  };
}

export function cancelTask(task: Task, cb) {
  return function(dispatch, getState) {
    dispatch(createTaskRequest())

    const httpClient = selectHttpClient(getState());

    httpClient
      .put(`${task['@id']}/cancel`, {})
      .then(cancelledTask => {
        dispatch(cancelTaskSuccess(cancelledTask))
        if(typeof cb === 'function') {
          setTimeout(() => cb(), 100);
        }
      })
      .catch(e => dispatch(cancelTaskFailure(e)));
  }
}

export function setTasksChangedAlertSound(enabled) {
  return (dispatch, getState) => {
    dispatch(_setTasksChangedAlertSound(enabled));
    tracker.logEvent(
      analyticsEvent.courier._category,
      analyticsEvent.courier.tasksChangedAlertSound,
      null,
      enabled ? 1 : 0,
    );
  };
}
