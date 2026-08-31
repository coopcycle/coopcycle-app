import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Alert, InteractionManager } from 'react-native';
import { createAction } from 'redux-actions';
import * as FileSystem from 'expo-file-system/legacy';

import { File } from 'expo-file-system';

import NavigationHolder from '../../NavigationHolder';
import analyticsEvent from '../../analytics/Event';
import tracker from '../../analytics/Tracker';
import i18n from '../../i18n';
import { selectPictures, selectSignatures } from './taskSelectors';
import { selectCurrentRoute, selectHttpClient } from '../App/selectors';
import UploadQueue from '../../services/UploadQueue';
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

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB — matches server limit

// Grace period before a queued upload starts, so the request the courier is
// actually waiting on gets the connection to itself first.
const UPLOAD_START_DELAY_MS = 2000;

async function findOversizedFiles(uris: string[]): Promise<string[]> {
  const results = await Promise.all(
    uris.map(async uri => {
      try {
        return await FileSystem.getInfoAsync(uri);
      } catch (e) {
        // A file we cannot even stat must not take the whole completion down
        // with it. This runs before anything is sent, so throwing here left
        // the courier with a screen that did nothing at all — no request, no
        // error. A file that has gone missing is the upload queue's problem.
        console.warn('Could not read file info', uri, e);
        return null;
      }
    }),
  );
  return uris.filter((_, i) => {
    const info = results[i];
    return info != null && info.exists && 'size' in info && (info.size as number) > MAX_FILE_SIZE_BYTES;
  });
}

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

    if (!httpClient) {
      return;
    }

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

function uploadEntityImages(entity, url) {
  return uploadEntitiesImages([entity], url);
}

function uploadEntitiesImages(entities, url) {
  return function (dispatch, getState) {
    const signatures = selectSignatures(getState());
    const pictures = selectPictures(getState());

    const files = signatures.concat(pictures);

    console.log(`Got ${files.length} file(s) to upload`);

    if (files.length === 0) {
      return;
    }

    const attachTo = entities.map(entity => entity['@id']);
    const jobs = files.map(fileUri => ({ fileUri, uploadUrl: url, attachTo }));

    return UploadQueue.enqueue(jobs)
      .then(() => {
        // Only once the jobs are written to the (persisted) queue: from here
        // on the files are the queue's responsibility — it is drained on app
        // start and by the OS background task, so they survive the app being
        // killed. Clearing them any earlier would make them vanish from the
        // screen with nothing left to upload them.
        dispatch(clearFiles());

        // Deliberately not started right away. The completion's own request
        // and the task list reload that follows are what the courier waits on,
        // and a proof-of-delivery photo is far heavier than either — starting
        // the upload here made them share a (usually cellular) uplink. It runs
        // once the screen transition is over and those have had time to
        // finish; whatever is left is picked up by the background task anyway.
        InteractionManager.runAfterInteractions(() => {
          setTimeout(
            () => dispatch(processUploadQueue()),
            UPLOAD_START_DELAY_MS,
          );
        });
      })
      .catch(e => {
        // The queue is the only record of these files, so if we could not
        // write to it we keep them in the store — they stay on screen, and
        // the courier can try again — rather than dropping them silently.
        console.warn('Could not enqueue uploads', e);
        alertUploadFailed();
      });
  };
}

/**
 * Whether a failed upload is worth keeping in the queue.
 *
 * No status means the request never got an answer (offline, timeout) — the
 * usual case out on a round, and precisely when retrying later is right.
 */
function isRetryableUploadStatus(status?: number): boolean {
  if (status === undefined) {
    return true;
  }

  if (status === 408 || status === 429) {
    return true;
  }

  return status >= 500;
}

function alertUploadFailed(status?: number) {
  Alert.alert(
    i18n.t('FAILED_TASK_COMPLETE'),
    status === 413 ? i18n.t('FILE_TOO_LARGE') : i18n.t('AN_ERROR_OCCURRED'),
    [{ text: 'OK' }],
    { cancelable: false },
  );
}

function discardUploadedFile(fileUri: string) {
  try {
    new File(fileUri).delete();
  } catch (e) {
    console.warn('Could not delete uploaded file', e);
  }
}

// A drain in progress. App start, every completion and the OS background task
// all ask for one, and concurrent drains read the same pending jobs and
// uploaded each file more than once — doubling the traffic on the connection
// the courier is already waiting on.
let uploadDrain: Promise<void> | null = null;

async function drainUploadQueue(getState) {
  const httpClient = selectHttpClient(getState());
  if (!httpClient) {
    return;
  }

  const jobs = await UploadQueue.getPending();
  if (jobs.length === 0) {
    return;
  }

  console.log(`Processing ${jobs.length} pending upload job(s)`);

  for (const job of jobs) {
    let status: number | undefined;

    try {
      const response = await httpClient.uploadFileAsync(
        job.uploadUrl,
        job.fileUri,
        { headers: { 'X-Attach-To': job.attachTo.join(';') } },
      );

      status = response?.status;
    } catch (e) {
      status = axios.isAxiosError(e) ? e.response?.status : undefined;
      console.warn('Upload error, status:', status, e);
    }

    if (status && status >= 200 && status < 300) {
      await UploadQueue.markDone(job.id);
      discardUploadedFile(job.fileUri);
      continue;
    }

    console.warn('Upload failed with status', status);

    if (!isRetryableUploadStatus(status)) {
      // The server will not take this file however often we offer it
      await UploadQueue.markDone(job.id);
      discardUploadedFile(job.fileUri);
      alertUploadFailed(status);
      continue;
    }

    const givenUp = await UploadQueue.recordFailedAttempt(job.id);

    if (givenUp) {
      discardUploadedFile(job.fileUri);
      alertUploadFailed(status);
      continue;
    }

    // The connection is the problem, so stop working through the queue —
    // the remaining jobs keep their place and the background task retries
    // them, rather than us hammering a link that is already struggling.
    break;
  }
}

export function processUploadQueue() {
  return function (dispatch, getState) {
    if (uploadDrain) {
      return uploadDrain;
    }

    uploadDrain = drainUploadQueue(getState).finally(() => {
      uploadDrain = null;
    });

    return uploadDrain;
  };
}

export function reportIncident(
  task,
  description = null,
  failureReasonCode = null,
  failureReasonMetadata = [],
  onSuccess,
) {
  return async function (dispatch, getState) {
    const files = [
      ...selectSignatures(getState()),
      ...selectPictures(getState()),
    ];
    const oversized = await findOversizedFiles(files);
    if (oversized.length > 0) {
      Alert.alert(i18n.t('FAILED_TASK_COMPLETE'), i18n.t('FILE_TOO_LARGE'));
      return;
    }

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
        // Do not wait for upload to finish
        dispatch(uploadEntityImages(incident, '/api/incident_images'));
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
    return httpClient
      .put(task['@id'] + '/failed', payload)
      .then(savedTask => {
        // Do not wait for upload to finish
        dispatch(uploadEntityImages(task, '/api/task_images'));
        dispatch(markTaskFailedSuccess(savedTask));
        if (typeof onSuccess === 'function') {
          setTimeout(() => onSuccess(), 100);
        }
      })
      .catch(e => {
        dispatch(markTaskFailedFailure(e));
        setTimeout(() => showAlert(e), 100);
      });
  };
}

export function markTaskDone(task, notes = '', onSuccess, contactName = '') {
  return async function (dispatch, getState) {
    const files = [
      ...selectSignatures(getState()),
      ...selectPictures(getState()),
    ];
    const oversized = await findOversizedFiles(files);
    if (oversized.length > 0) {
      Alert.alert(i18n.t('FAILED_TASK_COMPLETE'), i18n.t('FILE_TOO_LARGE'));
      return;
    }

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
    return httpClient
      .put(task['@id'] + '/done', payload)
      .then(savedTask => {
        // Do not wait for upload to finish
        dispatch(uploadEntityImages(task, '/api/task_images'))
        dispatch(markTaskDoneSuccess(savedTask));
        if (typeof onSuccess === 'function') {
          setTimeout(() => onSuccess(), 100);
        }
      })
      .catch(e => {
        dispatch(markTaskDoneFailure());
        setTimeout(() => showAlert(e), 100);
      });
  };
}

export function markTasksDone(tasks, notes = '', onSuccess, contactName = '') {
  return async function (dispatch, getState) {
    const files = [
      ...selectSignatures(getState()),
      ...selectPictures(getState()),
    ];
    const oversized = await findOversizedFiles(files);
    if (oversized.length > 0) {
      Alert.alert(i18n.t('FAILED_TASK_COMPLETE'), i18n.t('FILE_TOO_LARGE'));
      return;
    }

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

    return httpClient.put('/api/tasks/done', payload)
      .then(res => {
        if (res.failed && Object.keys(res.failed).length) {
          showAlertAfterBulk(Object.values(res.failed));
          if (!res.success || !res.success.length) {
            dispatch(markTasksDoneFailure());
          }
        }
        if (res.success && res.success.length) {
          // Queued only for the tasks the server actually completed, and only
          // once we know it did. Enqueueing up front cleared the files off
          // the screen even when every task had been refused — they were
          // gone, and attached to nothing.
          dispatch(uploadEntitiesImages(res.success, '/api/task_images'));
          dispatch(markTasksDoneSuccess(res.success));
          if (typeof onSuccess === 'function') {
            setTimeout(() => onSuccess(), 100);
          }
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
