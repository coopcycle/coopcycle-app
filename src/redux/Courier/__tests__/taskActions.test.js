import moment from 'moment';
import { configureStore } from '@reduxjs/toolkit';

import * as FileSystem from 'expo-file-system/legacy';

import {
  CLEAR_FILES,
  LOAD_TASKS_FAILURE,
  LOAD_TASKS_REQUEST,
  LOAD_TASKS_SUCCESS,
  clearFiles,
  loadTasks,
  loadTasksFailure,
  loadTasksRequest,
  loadTasksSuccess,
  markTaskDone,
  markTaskFailed,
  markTasksDone,
} from '../taskActions';
import {
  markTaskDoneFailure,
  markTaskDoneRequest,
  markTaskDoneSuccess,
  markTaskFailedFailure,
  markTaskFailedRequest,
  markTaskFailedSuccess,
} from '../../../shared/logistics/redux';
import reducers from '../../reducers';
import { httpClientService } from '../../../services/httpClientService';

// As we may be using setTimeout(), we need to mock timers
// @see https://jestjs.io/docs/en/timer-mocks.html
jest.useFakeTimers({ legacyFakeTimers: true });

// Custom middleware to track dispatched actions
const actionTrackerMiddleware = () => {
  let trackedActions = [];

  const middleware = () => next => action => {
    trackedActions.push(action);
    return next(action);
  };

  const getActions = () => trackedActions;
  const clearActions = () => (trackedActions = []);

  return {
    actionTracker: middleware,
    getActions,
    clearActions,
  };
};

describe('Redux | Tasks | Actions', () => {
  [
    {
      actionCreator: loadTasksRequest,
      actionType: LOAD_TASKS_REQUEST,
    },

    {
      actionCreator: loadTasksFailure,
      actionType: LOAD_TASKS_FAILURE,
    },

    {
      actionCreator: loadTasksSuccess,
      actionType: LOAD_TASKS_SUCCESS,
    },
  ].forEach(({ actionCreator, actionType }) => {
    test(`${actionType}`, () => {
      expect(actionCreator()).toMatchObject({ type: actionType });
    });
  });

  test('loadTasks | Successful request (legacy)', () => {
    const date = moment();
    const client = { get: jest.fn() };
    const dispatch = jest.fn();
    const resolveValue = {
      '@type': 'hydra:Collection',
      'hydra:member': [{ '@id': '/api/tasks/1' }],
    };

    client.get.mockResolvedValue(resolveValue);
    httpClientService.setTestClient(client);

    const store = configureStore({
      reducer: reducers,
      preloadedState: {},
    });

    const thk = loadTasks(date);
    const promise = thk(dispatch, store.getState);

    expect(thk).toBeInstanceOf(Function);
    expect(client.get).toHaveBeenCalledTimes(1);
    expect(client.get).toHaveBeenLastCalledWith(
      `/api/me/tasks/${date.format('YYYY-MM-DD')}`,
    );

    return promise.then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: LOAD_TASKS_REQUEST,
        payload: { date: date.toISOString(), refresh: false },
      });
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          type: LOAD_TASKS_SUCCESS,
          payload: expect.objectContaining({
            date: date.format('YYYY-MM-DD'),
            items: resolveValue['hydra:member'],
            updatedAt: expect.any(String),
          }),
        }),
      );
    });
  });

  test('loadTasks | Successful request', () => {
    const date = moment();
    const client = { get: jest.fn() };
    const dispatch = jest.fn();
    const resolveValue = {
      '@type': 'TaskList',
      items: [{ '@id': '/api/tasks/1' }],
      updatedAt: moment().toISOString(),
    };

    client.get.mockResolvedValue(resolveValue);
    httpClientService.setTestClient(client);

    const store = configureStore({
      reducer: reducers,
      preloadedState: {},
    });

    const thk = loadTasks(date);
    const promise = thk(dispatch, store.getState);

    expect(thk).toBeInstanceOf(Function);
    expect(client.get).toHaveBeenCalledTimes(1);
    expect(client.get).toHaveBeenLastCalledWith(
      `/api/me/tasks/${date.format('YYYY-MM-DD')}`,
    );

    return promise.then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: LOAD_TASKS_REQUEST,
        payload: { date: date.toISOString(), refresh: false },
      });
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          type: LOAD_TASKS_SUCCESS,
          payload: expect.objectContaining({
            date: date.format('YYYY-MM-DD'),
            items: resolveValue.items,
            updatedAt: expect.any(String),
          }),
        }),
      );
    });
  });

  test('loadTasks | Failed request', () => {
    const date = moment();
    const client = { get: jest.fn() };
    const dispatch = jest.fn();
    const rejectValue = new Error('test error');

    client.get.mockReturnValue(Promise.reject(rejectValue));
    httpClientService.setTestClient(client);

    const store = configureStore({
      reducer: reducers,
      preloadedState: {},
    });

    const thk = loadTasks(date);
    const promise = thk(dispatch, store.getState);

    expect(thk).toBeInstanceOf(Function);
    expect(client.get).toHaveBeenCalledTimes(1);
    expect(client.get).toHaveBeenLastCalledWith(
      `/api/me/tasks/${date.format('YYYY-MM-DD')}`,
    );

    return promise.catch(() => {
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: LOAD_TASKS_REQUEST,
        payload: { date: date.toISOString() },
      });
      expect(dispatch).toHaveBeenLastCalledWith({
        type: LOAD_TASKS_FAILURE,
        payload: rejectValue,
      });
    });
  });

  test('markTaskDone | Successful request', () => {
    const task = { '@id': '/api/tasks/1' };
    const notes = 'notes';
    const resolveValue = { ...task };

    const client = {
      put: jest.fn(),
    };
    client.put.mockResolvedValue(resolveValue);
    client.put.mockResolvedValue(resolveValue);
    httpClientService.setTestClient(client);

    const { actionTracker, getActions } = actionTrackerMiddleware();
    const store = configureStore({
      reducer: reducers,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(actionTracker),
      preloadedState: {
        entities: {
          tasks: {
            signatures: [],
            pictures: [],
          },
        },
      },
    });

    // Make sure to return the promise
    return store.dispatch(markTaskDone(task, notes)).then(() => {
      const actions = getActions();

      expect(actions).toContainEqual(markTaskDoneRequest(task));
      expect(actions).toContainEqual(markTaskDoneSuccess(resolveValue));

      expect(client.put).toHaveBeenCalledTimes(1);
      expect(client.put).not.toHaveBeenCalledWith(task['@id'], { images: [] });
      expect(client.put).toHaveBeenCalledWith(`${task['@id']}/done`, { notes });
    });
  });

  test('markTaskDone with PoDs | Successful request', async () => {
    const task = { '@id': '/api/tasks/1' };
    const notes = 'notes';
    const resolveValue = { ...task };

    const client = {
      put: jest.fn(),
      getToken: () => '123456',
      getBaseURL: () => 'https://test.coopcycle.org',
      uploadFile: jest.fn(),
      uploadFileAsync: jest.fn(),
    };
    client.put.mockResolvedValue(resolveValue);
    client.put.mockResolvedValue(resolveValue);
    client.uploadFileAsync.mockResolvedValue({ status: 200 });
    httpClientService.setTestClient(client);

    const { actionTracker, getActions } = actionTrackerMiddleware();
    const store = configureStore({
      reducer: reducers,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(actionTracker),
      preloadedState: {
        entities: {
          tasks: {
            signatures: ['123456'],
            pictures: [],
          },
        },
      },
    });

    await store.dispatch(markTaskDone(task, notes));

    // The upload is enqueued during markTaskDone but deliberately not started
    // until the screen transition is over and the requests the courier is
    // waiting on have had the connection to themselves, so let the queue write
    // settle, run the pending interactions, then let the grace period elapse.
    for (let i = 0; i < 5; i++) {
      await Promise.resolve();
    }

    jest.runAllTimers();
    await Promise.resolve();
    jest.runAllTimers();

    // enqueue (AsyncStorage.getItem → setItem) → processUploadQueue
    // (AsyncStorage.getItem) → uploadFileAsync; each AsyncStorage operation
    // resolves in one microtask tick, so we flush several times again.
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    const actions = getActions();

    expect(actions).toContainEqual(markTaskDoneRequest(task));
    expect(actions).toContainEqual(markTaskDoneSuccess(resolveValue));

    expect(client.put).toHaveBeenCalledTimes(1);
    expect(client.uploadFileAsync).toHaveBeenCalledTimes(1);
    expect(client.uploadFileAsync).toHaveBeenCalledWith(
      '/api/task_images',
      '123456',
      { headers: { 'X-Attach-To': '/api/tasks/1' } },
    );
    expect(client.put).toHaveBeenCalledWith(`${task['@id']}/done`, { notes });
  });

  // A file we cannot stat used to reject the whole thunk before anything was
  // dispatched: no request, no alert, and a submit button that stayed
  // disabled because Formik never saw the promise settle.
  test('markTaskDone | Unreadable file does not abort the completion', async () => {
    const task = { '@id': '/api/tasks/1' };
    const notes = 'notes';
    const resolveValue = { ...task };

    FileSystem.getInfoAsync.mockRejectedValueOnce(new Error('cannot stat'));

    const client = {
      put: jest.fn(),
      getToken: () => '123456',
      getBaseURL: () => 'https://test.coopcycle.org',
      uploadFileAsync: jest.fn().mockResolvedValue({ status: 200 }),
    };
    client.put.mockResolvedValue(resolveValue);
    httpClientService.setTestClient(client);

    const { actionTracker, getActions } = actionTrackerMiddleware();
    const store = configureStore({
      reducer: reducers,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(actionTracker),
      preloadedState: {
        entities: {
          tasks: {
            signatures: ['file:///gone.jpg'],
            pictures: [],
          },
        },
      },
    });

    await store.dispatch(markTaskDone(task, notes));

    const actions = getActions();

    expect(actions).toContainEqual(markTaskDoneRequest(task));
    expect(actions).toContainEqual(markTaskDoneSuccess(resolveValue));
    expect(client.put).toHaveBeenCalledWith(`${task['@id']}/done`, { notes });
  });

  // The files were enqueued (and so cleared off the screen) before we knew
  // whether the server had accepted anything at all.
  test('markTasksDone | Files are kept when every task is refused', async () => {
    const tasks = [{ '@id': '/api/tasks/1' }, { '@id': '/api/tasks/2' }];

    const client = {
      put: jest.fn(),
      getToken: () => '123456',
      getBaseURL: () => 'https://test.coopcycle.org',
      uploadFileAsync: jest.fn().mockResolvedValue({ status: 200 }),
    };
    client.put.mockResolvedValue({
      success: [],
      failed: { '/api/tasks/1': 'Not yours', '/api/tasks/2': 'Not yours' },
    });
    httpClientService.setTestClient(client);

    const { actionTracker, getActions } = actionTrackerMiddleware();
    const store = configureStore({
      reducer: reducers,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(actionTracker),
      preloadedState: {
        entities: {
          tasks: {
            signatures: ['file:///signature.jpg'],
            pictures: ['file:///picture.jpg'],
          },
        },
      },
    });

    await store.dispatch(markTasksDone(tasks, 'notes'));

    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }
    jest.runAllTimers();

    expect(getActions()).not.toContainEqual(
      expect.objectContaining({ type: CLEAR_FILES }),
    );
    expect(client.uploadFileAsync).not.toHaveBeenCalled();

    const { signatures, pictures } = store.getState().entities.tasks;
    expect(signatures).toEqual(['file:///signature.jpg']);
    expect(pictures).toEqual(['file:///picture.jpg']);
  });

  test('markTaskDone | Failed request', () => {
    const task = { '@id': 1 };
    const notes = 'notes';
    const rejectValue = new Error('test error');

    const client = {
      put: jest.fn(),
    };
    client.put.mockRejectedValue(rejectValue);
    httpClientService.setTestClient(client);

    const { actionTracker, getActions } = actionTrackerMiddleware();
    const store = configureStore({
      reducer: reducers,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(actionTracker),
      preloadedState: {
        entities: {
          tasks: {
            signatures: [],
            pictures: [],
          },
        },
      },
    });

    // Make sure to return the promise
    return store.dispatch(markTaskDone(task, notes)).then(() => {
      const actions = getActions();

      expect(actions).toContainEqual(markTaskDoneRequest(task));
      expect(actions).toContainEqual(markTaskDoneFailure());

      expect(client.put).toHaveBeenCalledTimes(1);
      expect(client.put).not.toHaveBeenCalledWith(task['@id'], { images: [] });
      expect(client.put).toHaveBeenCalledWith(`${task['@id']}/done`, { notes });
    });
  });

  test('markTaskFailed | Successful request', () => {
    const task = { '@id': '/api/tasks/1' };
    const notes = 'notes';
    const reason = 'REASON';
    const resolveValue = { ...task };

    const client = {
      put: jest.fn(),
    };
    client.put.mockResolvedValue(resolveValue);
    client.put.mockResolvedValue(resolveValue);
    httpClientService.setTestClient(client);

    const { actionTracker, getActions } = actionTrackerMiddleware();
    const store = configureStore({
      reducer: reducers,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(actionTracker),
      preloadedState: {
        entities: {
          tasks: {
            signatures: [],
            pictures: [],
          },
        },
      },
    });

    // Make sure to return the promise
    return store.dispatch(markTaskFailed(task, notes, reason)).then(() => {
      const actions = getActions();

      expect(actions).toContainEqual(markTaskFailedRequest(task));
      expect(actions).toContainEqual(markTaskFailedSuccess(resolveValue));

      expect(client.put).toHaveBeenCalledTimes(1);
      expect(client.put).not.toHaveBeenCalledWith(task['@id'], {
        images: [],
      });
      expect(client.put).toHaveBeenCalledWith(`${task['@id']}/failed`, {
        notes,
        reason,
      });
    });
  });

  test('markTaskFailed | Failed request', () => {
    const task = { '@id': 1 };
    const notes = 'notes';
    const reason = 'REASON';
    const rejectValue = new Error('test error');

    const client = {
      put: jest.fn(),
    };
    client.put.mockRejectedValue(rejectValue);
    httpClientService.setTestClient(client);

    const { actionTracker, getActions } = actionTrackerMiddleware();
    const store = configureStore({
      reducer: reducers,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(actionTracker),
      preloadedState: {
        entities: {
          tasks: {
            signatures: [],
            pictures: [],
          },
        },
      },
    });

    // Make sure to return the promise
    return store.dispatch(markTaskFailed(task, notes, reason)).then(() => {
      const actions = getActions();

      expect(actions).toContainEqual(markTaskFailedRequest(task));
      expect(actions).toContainEqual(markTaskFailedFailure(rejectValue));

      expect(client.put).toHaveBeenCalledTimes(1);
      expect(client.put).not.toHaveBeenCalledWith(task['@id'], {
        images: [],
      });
      expect(client.put).toHaveBeenCalledWith(`${task['@id']}/failed`, {
        notes,
        reason,
      });
    });
  });
});
