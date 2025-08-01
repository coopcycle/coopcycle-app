import moment from 'moment';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
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
} from '../taskActions';
import {
  markTaskDoneFailure,
  markTaskDoneRequest,
  markTaskDoneSuccess,
  markTaskFailedFailure,
  markTaskFailedRequest,
  markTaskFailedSuccess,
} from '../../../shared/logistics/redux';

// As we may be using setTimeout(), we need to mock timers
// @see https://jestjs.io/docs/en/timer-mocks.html
jest.useFakeTimers({ legacyFakeTimers: true });

// https://github.com/dmitry-zaets/redux-mock-store#asynchronous-actions
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

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

    const store = mockStore({
      app: { httpClient: client },
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
        payload: { date, refresh: false },
      });
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          type: LOAD_TASKS_SUCCESS,
          payload: expect.objectContaining({
            date: date.format('YYYY-MM-DD'),
            items: resolveValue['hydra:member'],
            updatedAt: expect.any(moment),
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
      updatedAt: moment().format(),
    };

    client.get.mockResolvedValue(resolveValue);

    const store = mockStore({
      app: { httpClient: client },
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
        payload: { date, refresh: false },
      });
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          type: LOAD_TASKS_SUCCESS,
          payload: expect.objectContaining({
            date: date.format('YYYY-MM-DD'),
            items: resolveValue.items,
            updatedAt: expect.any(moment),
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

    const store = mockStore({
      app: { httpClient: client },
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
        payload: date,
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
      execUploadTask: jest.fn(),
    };
    client.put.mockResolvedValue(resolveValue);
    client.put.mockResolvedValue(resolveValue);

    const store = mockStore({
      app: { httpClient: client },
      entities: {
        tasks: {
          signatures: [],
          pictures: [],
        },
      },
    });

    // Make sure to return the promise
    return store.dispatch(markTaskDone(task, notes)).then(() => {
      const actions = store.getActions();

      expect(actions).toContainEqual(markTaskDoneRequest(task));
      expect(actions).toContainEqual(clearFiles());
      expect(actions).toContainEqual(markTaskDoneSuccess(resolveValue));

      expect(client.put).toHaveBeenCalledTimes(1);
      expect(client.put).not.toHaveBeenCalledWith(task['@id'], { images: [] });
      expect(client.put).toHaveBeenCalledWith(`${task['@id']}/done`, { notes });
    });
  });

  test('markTaskDone with PoDs | Successful request', () => {
    const task = { '@id': '/api/tasks/1' };
    const notes = 'notes';
    const resolveValue = { ...task };

    const client = {
      put: jest.fn(),
      getToken: () => '123456',
      getBaseURL: () => 'https://test.coopcycle.org',
      uploadFile: jest.fn(),
      uploadFileAsync: jest.fn(),
      execUploadTask: jest.fn(),
    };
    client.put.mockResolvedValue(resolveValue);
    client.put.mockResolvedValue(resolveValue);
    client.uploadFileAsync.mockResolvedValue();

    const store = mockStore({
      app: { httpClient: client },
      entities: {
        tasks: {
          signatures: ['123456'],
          pictures: [],
        },
      },
    });

    // Make sure to return the promise
    return store.dispatch(markTaskDone(task, notes)).then(() => {
      const actions = store.getActions();

      expect(actions).toContainEqual(markTaskDoneRequest(task));
      expect(actions).toContainEqual(clearFiles());
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
  });

  test('markTaskDone | Failed request', () => {
    const task = { '@id': 1 };
    const notes = 'notes';
    const rejectValue = new Error('test error');

    const client = {
      put: jest.fn(),
      execUploadTask: jest.fn(),
    };
    client.put.mockRejectedValue(rejectValue);

    const store = mockStore({
      app: { httpClient: client },
      entities: {
        tasks: {
          signatures: [],
          pictures: [],
        },
      },
    });

    // Make sure to return the promise
    return store.dispatch(markTaskDone(task, notes)).then(() => {
      const actions = store.getActions();

      expect(actions).toContainEqual(markTaskDoneRequest(task));
      expect(actions).toContainEqual(markTaskDoneFailure(rejectValue));

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
      execUploadTask: jest.fn(),
    };
    client.put.mockResolvedValue(resolveValue);
    client.put.mockResolvedValue(resolveValue);

    const store = mockStore({
      app: { httpClient: client },
      entities: {
        tasks: {
          signatures: [],
          pictures: [],
        },
      },
    });

    // Make sure to return the promise
    return store.dispatch(markTaskFailed(task, notes, reason)).then(() => {
      const actions = store.getActions();

      expect(actions).toContainEqual(markTaskFailedRequest(task));
      expect(actions).toContainEqual(clearFiles());
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

    const store = mockStore({
      app: { httpClient: client },
      entities: {
        tasks: {
          signatures: [],
          pictures: [],
        },
      },
    });

    // Make sure to return the promise
    return store.dispatch(markTaskFailed(task, notes, reason)).then(() => {
      const actions = store.getActions();

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
