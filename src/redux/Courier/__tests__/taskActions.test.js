import moment from 'moment'
import {
  LOAD_TASKS_REQUEST, LOAD_TASKS_SUCCESS, LOAD_TASKS_FAILURE,
  MARK_TASK_DONE_REQUEST, MARK_TASK_DONE_SUCCESS, MARK_TASK_DONE_FAILURE,
  MARK_TASK_FAILED_REQUEST, MARK_TASK_FAILED_SUCCESS, MARK_TASK_FAILED_FAILURE,
  DONT_TRIGGER_TASKS_NOTIFICATION,

  loadTasksRequest, loadTasksSuccess, loadTasksFailure,
  markTaskDoneRequest, markTaskDoneSuccess, markTaskDoneFailure,
  markTaskFailedRequest, markTaskFailedSuccess, markTaskFailedFailure,
  dontTriggerTasksNotification,

  loadTasks, markTaskDone, markTaskFailed,
} from '../taskActions'


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

    {
      actionCreator: markTaskDoneRequest,
      actionType: MARK_TASK_DONE_REQUEST,
    },

    {
      actionCreator: markTaskDoneFailure,
      actionType: MARK_TASK_DONE_FAILURE,
    },

    {
      actionCreator: markTaskDoneSuccess,
      actionType: MARK_TASK_DONE_SUCCESS,
    },

    {
      actionCreator: markTaskFailedRequest,
      actionType: MARK_TASK_FAILED_REQUEST,
    },

    {
      actionCreator: markTaskFailedFailure,
      actionType: MARK_TASK_FAILED_FAILURE,
    },

    {
      actionCreator: markTaskFailedSuccess,
      actionType: MARK_TASK_FAILED_SUCCESS,
    },

    {
      actionCreator: dontTriggerTasksNotification,
      actionType: DONT_TRIGGER_TASKS_NOTIFICATION,
    },
  ]
    .forEach(({ actionCreator, actionType }) => {
      test(`${actionType}`, () => {
        expect(actionCreator()).toEqual({ type: actionType })
      })
    })

  test('loadTasks | Successful request', () => {
    const date = moment()
    const client = { get: jest.fn() }
    const dispatch = jest.fn()
    const resolveValue = { 'hydra:member': 'foo' }

    client.get.mockResolvedValue(resolveValue)

    const thunk = loadTasks(client, date)
    const promise = thunk(dispatch)

    expect(thunk).toBeInstanceOf(Function)
    expect(client.get).toHaveBeenCalledTimes(1)
    expect(client.get).toHaveBeenLastCalledWith(`/api/me/tasks/${date.format('YYYY-MM-DD')}`)

    return promise.then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith({ type: LOAD_TASKS_REQUEST, payload: date })
      expect(dispatch).toHaveBeenLastCalledWith({ type: LOAD_TASKS_SUCCESS, payload: resolveValue['hydra:member'] })
    })
  })

  test('loadTasks | Failed request', () => {
    const date = moment()
    const client = { get: jest.fn() }
    const dispatch = jest.fn()
    const rejectValue = new Error('test error')

    client.get.mockReturnValue(Promise.reject(rejectValue))

    const thunk = loadTasks(client, date)
    const promise = thunk(dispatch)

    expect(thunk).toBeInstanceOf(Function)
    expect(client.get).toHaveBeenCalledTimes(1)
    expect(client.get).toHaveBeenLastCalledWith(`/api/me/tasks/${date.format('YYYY-MM-DD')}`)

    return promise.catch(() => {
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith({ type: LOAD_TASKS_REQUEST, payload: date })
      expect(dispatch).toHaveBeenLastCalledWith({ type: LOAD_TASKS_FAILURE, payload: rejectValue })
    })
  })

  test('markTaskDone | Successful request', () => {
    const task = { '@id': 1 }
    const notes = 'notes'
    const client = { put: jest.fn() }
    const dispatch = jest.fn()
    const resolveValue = { ...task }

    client.put.mockResolvedValue(resolveValue)

    const thunk = markTaskDone(client, task, notes)
    const promise = thunk(dispatch)

    expect(thunk).toBeInstanceOf(Function)
    expect(client.put).toHaveBeenCalledTimes(1)
    expect(client.put).toHaveBeenLastCalledWith(`${task['@id']}/done`, { reason: notes })

    return promise.then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith({ type: MARK_TASK_DONE_REQUEST, payload: task })
      expect(dispatch).toHaveBeenLastCalledWith({ type: MARK_TASK_DONE_SUCCESS, payload: resolveValue })
    })
  })

  test('markTaskDone | Failed request', () => {
    const task = { '@id': 1 }
    const notes = 'notes'
    const client = { put: jest.fn() }
    const dispatch = jest.fn()
    const rejectValue = new Error('test error')

    client.put.mockReturnValue(Promise.reject(rejectValue))

    const thunk = markTaskDone(client, task, notes)
    const promise = thunk(dispatch)

    expect(thunk).toBeInstanceOf(Function)
    expect(client.put).toHaveBeenCalledTimes(1)
    expect(client.put).toHaveBeenLastCalledWith(`${task['@id']}/done`, { reason: notes })

    return promise.then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith({ type: MARK_TASK_DONE_REQUEST, payload: task })
      expect(dispatch).toHaveBeenLastCalledWith({ type: MARK_TASK_DONE_FAILURE, payload: rejectValue, error: true })
    })
  })

  test('markTaskFailed | Successful request', () => {
    const task = { '@id': 1 }
    const notes = 'notes'
    const client = { put: jest.fn() }
    const dispatch = jest.fn()
    const resolveValue = { ...task }

    client.put.mockResolvedValue(resolveValue)

    const thunk = markTaskFailed(client, task, notes)
    const promise = thunk(dispatch)

    expect(thunk).toBeInstanceOf(Function)
    expect(client.put).toHaveBeenCalledTimes(1)
    expect(client.put).toHaveBeenLastCalledWith(`${task['@id']}/failed`, { reason: notes })

    return promise.then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith({ type: MARK_TASK_FAILED_REQUEST, payload: task })
      expect(dispatch).toHaveBeenLastCalledWith({ type: MARK_TASK_FAILED_SUCCESS, payload: resolveValue })
    })
  })

  test('markTaskFailed | Failed request', () => {
    const task = { '@id': 1 }
    const notes = 'notes'
    const client = { put: jest.fn() }
    const dispatch = jest.fn()
    const rejectValue = new Error('test error')

    client.put.mockReturnValue(Promise.reject(rejectValue))

    const thunk = markTaskFailed(client, task, notes)
    const promise = thunk(dispatch)

    expect(thunk).toBeInstanceOf(Function)
    expect(client.put).toHaveBeenCalledTimes(1)
    expect(client.put).toHaveBeenLastCalledWith(`${task['@id']}/failed`, { reason: notes })

    return promise.then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith({ type: MARK_TASK_FAILED_REQUEST, payload: task })
      expect(dispatch).toHaveBeenLastCalledWith({ type: MARK_TASK_FAILED_FAILURE, payload: rejectValue, error: true })
    })
  })
})
