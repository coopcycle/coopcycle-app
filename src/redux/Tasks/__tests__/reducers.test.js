import { omit } from 'lodash'
import moment from 'moment'
import { tasksEntityReducer, tasksUiReducer } from '../reducers'
import {
  loadTasksRequest, loadTasksFailure, loadTasksSuccess,
  markTaskDoneRequest, markTaskDoneFailure, markTaskDoneSuccess,
  markTaskFailedRequest, markTaskFailedFailure, markTaskFailedSuccess,
  dontTriggerTasksNotification,
} from '../actions'
import { message } from '../../middlewares/WebSocketMiddleware'


describe('Redux | Tasks | Reducers', () => {
  describe('tasksUiReducer', () => {
    test(`${loadTasksRequest}`, () => {
      const now = moment()
      const then = now.subtract(1, 'hour')
      const initialState = {
        ...tasksUiReducer(undefined, {}),
        selectedDate: then,
      }
      const newState = tasksUiReducer(initialState, loadTasksRequest(now))

      const restOldState = omit(initialState, ['selectedDate'])
      const restNewState = omit(newState, ['selectedDate'])

      expect(newState).toEqual(expect.objectContaining({
        selectedDate: now,
      }))
      expect(restOldState).toEqual(restNewState)
    })
  })

  describe('tasksEntityReducer', () => {
    [
      loadTasksRequest,
      markTaskDoneRequest,
      markTaskFailedRequest,
    ]
      .forEach((actionCreator) => {
        test(`${actionCreator}`, () => {
          const initialState = {
            ...tasksEntityReducer(undefined, {}),
            fetchError: true,
          }
          const newState = tasksEntityReducer(initialState, actionCreator())

          const restOldState = omit(initialState, ['fetchError', 'isFetching'])
          const restNewState = omit(newState, ['fetchError', 'isFetching'])

          expect(restOldState).toEqual(restNewState)
          expect(newState).toEqual(expect.objectContaining({
            isFetching: true,
            fetchError: false,
          }))
        })
      });

    [
      loadTasksFailure,
      markTaskDoneFailure,
      markTaskFailedFailure,
    ]
      .forEach((actionCreator) => {
        test(`${actionCreator}`, () => {
          const error = new Error('test error')
          const initialState = {
            ...tasksEntityReducer(undefined, {}),
            isFetching: true,
          }
          const newState = tasksEntityReducer(initialState, actionCreator(error))

          const restOldState = omit(initialState, ['fetchError', 'isFetching'])
          const restNewState = omit(newState, ['fetchError', 'isFetching'])

          expect(restOldState).toEqual(restNewState)
          expect(newState).toEqual(expect.objectContaining({
            fetchError: error,
            isFetching: false,
          }))
        })
      })

    test(`${loadTasksSuccess}`, () => {
      const tasks = [{ id: 1 }, { id: 2 }]
      const initialState = {
        ...tasksEntityReducer(undefined, {}),
        fetchError: true,
        isFetching: true,
        isStale: true,
      }
      const newState = tasksEntityReducer(initialState, loadTasksSuccess(tasks))

      const restOldState = omit(initialState, ['fetchError', 'isFetching', 'isStale', 'items', 'order', 'lastUpdated'])
      const restNewState = omit(newState, ['fetchError', 'isFetching', 'isStale', 'items', 'order', 'lastUpdated'])
      const { lastUpdated: lastUpdatedOld } = initialState
      const { lastUpdated: lastUpdatedNew } = newState

      expect(newState).toEqual(expect.objectContaining({
        fetchError: false,
        isFetching: false,
        isStale: false,
        items: { 1: tasks[0], 2: tasks[1] },
        order: [1, 2]
      }))

      expect(restOldState).toEqual(restNewState)
      expect(lastUpdatedNew).not.toEqual(lastUpdatedOld)
    });

    [
      markTaskDoneSuccess,
      markTaskFailedSuccess,
    ]
      .forEach((actionCreator) => {
        test(`${actionCreator}`, () => {
          const task = { id: 1, foo: 'bar' }
          const initialState = {
            ...tasksEntityReducer(undefined, {}),
            items: { 1: task },
            order: [1],
          }

          const newState = tasksEntityReducer(initialState, actionCreator({ ...task, foo: 'foo' }))

          const restOldState = omit(initialState, ['lastUpdated', 'items'])
          const restNewState = omit(newState, ['lastUpdated', 'items'])
          const { lastUpdated: lastUpdatedOld } = initialState
          const { lastUpdated: lastUpdatedNew } = newState

          expect(newState).toEqual(expect.objectContaining({
            items: { 1: { ...task, foo: 'foo' } }
          }))

          expect(restOldState).toEqual(restNewState)
          expect(lastUpdatedNew).not.toEqual(lastUpdatedOld)
        })
      })


    test(`${dontTriggerTasksNotification}`, () => {
      const initialState = {
        ...tasksEntityReducer(undefined, {}),
        triggerTasksNotification: true,
      }
      const newState = tasksEntityReducer(initialState, dontTriggerTasksNotification())

      const restOldState = omit(initialState, ['triggerTasksNotification'])
      const restNewState = omit(newState, ['triggerTasksNotification'])

      expect(newState).toEqual(expect.objectContaining({
        triggerTasksNotification: false
      }))
      expect(restOldState).toEqual(restNewState)
    })

    test(`${message} | tasks:changed`, () => {
      const tasks = [{ id: 1 }, { id: 2 }]
      const wsMsg = { type: 'tasks:changed', tasks }

      const initialState = {
        ...tasksEntityReducer(undefined, {}),
        isStale: true,
        triggerTasksNotification: false,
      }

      const newState = tasksEntityReducer(initialState, message(wsMsg))

      const restOldState = omit(initialState, ['isStale', 'lastUpdated', 'triggerTasksNotification', 'items', 'order'])
      const restNewState = omit(newState, ['isStale', 'lastUpdated', 'triggerTasksNotification', 'items', 'order'])
      const { lastUpdated: lastUpdatedOld } = initialState
      const { lastUpdated: lastUpdatedNew } = newState

      expect(lastUpdatedOld).not.toEqual(lastUpdatedNew)
      expect(newState).toEqual(expect.objectContaining({
        isStale: false,
        triggerTasksNotification: true,
        items: { 1: tasks[0], 2: tasks[1] },
        order: [1, 2]
      }))
      expect(restOldState).toEqual(restNewState)
    })

    test(`${message} | task:assign`, () => {
      const task = { id: 3, position: 1 }
      const wsMsg = { type: 'task:assign', task: { ...task, foo: 'bar' } }

      const initialState = {
        ...tasksEntityReducer(undefined, {}),
        items: { 1: { id: 1 }, 2: { id: 2 } },
        order: [1, 2]
      }

      const newState = tasksEntityReducer(initialState, message(wsMsg))

      const restOldState = omit(initialState, ['lastUpdated', 'items', 'order'])
      const restNewState = omit(newState, ['lastUpdated', 'items', 'order'])
      const { lastUpdated: lastUpdatedOld } = initialState
      const { lastUpdated: lastUpdatedNew } = newState

      expect(lastUpdatedOld).not.toEqual(lastUpdatedNew)
      expect(newState).toEqual(expect.objectContaining({
        items: { 1: { id: 1 }, 2: { id: 2 }, 3: wsMsg.task },
        order: [1, 3, 2],
      }))
      expect(restOldState).toEqual(restNewState)
    })

    test(`${message} | task:unassign`, () => {
      const task = { '@id': 2 }
      const wsMsg = { type: 'task:unassign', task }

      const initialState = {
        ...tasksEntityReducer(undefined, {}),
        items: { 1: { id: 1 }, 2: { id: 2 } },
        order: [1, 2]
      }

      const newState = tasksEntityReducer(initialState, message(wsMsg))

      const restOldState = omit(initialState, ['lastUpdated', 'items', 'order'])
      const restNewState = omit(newState, ['lastUpdated', 'items', 'order'])
      const { lastUpdated: lastUpdatedOld } = initialState
      const { lastUpdated: lastUpdatedNew } = newState

      expect(lastUpdatedOld).not.toEqual(lastUpdatedNew)
      expect(newState).toEqual(expect.objectContaining({
        items: { 1: { id: 1 } },
        order: [1],
      }))
      expect(restOldState).toEqual(restNewState)
    })

    test(`${message} | unrecognized message type`, () => {
      const initialState = tasksEntityReducer(undefined, {})
      const newState = tasksEntityReducer(initialState, message({ type: 'fake' }))

      expect(newState).toEqual(initialState)
    })
  })
})
