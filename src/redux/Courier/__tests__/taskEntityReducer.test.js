import { omit } from 'lodash'
import moment from 'moment'
import { tasksEntityReducer } from '../taskEntityReducer'
import {
  loadTasksRequest, loadTasksFailure, loadTasksSuccess,
  markTaskDoneRequest, markTaskDoneFailure, markTaskDoneSuccess,
  markTaskFailedRequest, markTaskFailedFailure, markTaskFailedSuccess,
  dontTriggerTasksNotification,
} from '../taskActions'
import {
  selectIsTasksLoading, selectIsTasksLoadingFailure, selectTasks,
  selectTaskSelectedDate, selectTasksList, selectTasksOrder,
  selectTriggerTasksNotification,
} from '../taskSelectors';
import { message } from '../../middlewares/WebSocketMiddleware'


describe('Redux | Tasks | Reducers', () => {
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
          const fullState = { entities: { tasks: newState } }

          const restOldState = omit(initialState, ['fetchError', 'isFetching'])
          const restNewState = omit(newState, ['fetchError', 'isFetching'])

          expect(restOldState).toEqual(restNewState)
          expect(selectIsTasksLoading(fullState)).toEqual(true)
          expect(selectIsTasksLoadingFailure(fullState)).toEqual(false)
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
          const fullState = { entities: { tasks: newState } }

          const restOldState = omit(initialState, ['fetchError', 'isFetching'])
          const restNewState = omit(newState, ['fetchError', 'isFetching'])

          expect(restOldState).toEqual(restNewState)
          expect(selectIsTasksLoading(fullState)).toEqual(false)
          expect(selectIsTasksLoadingFailure(fullState)).toEqual(error)
        })
      })

    test(`${loadTasksSuccess}`, () => {
      const tasks = [{ id: 1 }, { id: 2 }]
      const initialState = {
        ...tasksEntityReducer(undefined, {}),
        fetchError: true,
        isFetching: true,
      }
      const newState = tasksEntityReducer(initialState, loadTasksSuccess(tasks))
      const fullState = { entities: { tasks: newState } }

      const restOldState = omit(initialState, ['fetchError', 'isFetching', 'items', 'order', 'lastUpdated'])
      const restNewState = omit(newState, ['fetchError', 'isFetching', 'items', 'order', 'lastUpdated'])
      const { lastUpdated: lastUpdatedOld } = initialState
      const { lastUpdated: lastUpdatedNew } = newState

      expect(selectIsTasksLoading(fullState)).toBe(false)
      expect(selectIsTasksLoadingFailure(fullState)).toBe(false)
      expect(selectTasksList(fullState)).toEqual(tasks)

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
          const fullState = { entities: { tasks: newState } }

          const restOldState = omit(initialState, ['lastUpdated', 'items'])
          const restNewState = omit(newState, ['lastUpdated', 'items'])
          const { lastUpdated: lastUpdatedOld } = initialState
          const { lastUpdated: lastUpdatedNew, isFetching } = newState

          expect(selectTasksList(fullState)).toEqual([{ ...task, foo: 'foo' }]);

          expect(restOldState).toEqual(restNewState)
          expect(lastUpdatedNew).toEqual(lastUpdatedOld)
          expect(isFetching).toBeFalsy()
        })
      })


    test(`${dontTriggerTasksNotification}`, () => {
      const initialState = {
        ...tasksEntityReducer(undefined, {}),
        triggerTasksNotification: true,
      }
      const newState = tasksEntityReducer(initialState, dontTriggerTasksNotification())
      const fullState = { entities: { tasks: newState } }

      const restOldState = omit(initialState, ['triggerTasksNotification'])
      const restNewState = omit(newState, ['triggerTasksNotification'])

      expect(selectTriggerTasksNotification(fullState)).toBe(false);
      expect(restOldState).toEqual(restNewState)
    })

    test(`${message} | tasks:changed`, () => {
      const tasks = [{ id: 1, position: 1 }, { id: 2, position: 0 }]
      const wsMsg = { type: 'tasks:changed', tasks }

      const initialState = {
        ...tasksEntityReducer(undefined, {}),
        triggerTasksNotification: false,
      }

      const newState = tasksEntityReducer(initialState, message(wsMsg))
      const fullState = { entities: { tasks: newState } }

      const restOldState = omit(initialState, ['lastUpdated', 'triggerTasksNotification', 'items', 'order'])
      const restNewState = omit(newState, ['lastUpdated', 'triggerTasksNotification', 'items', 'order'])
      const { lastUpdated: lastUpdatedOld } = initialState
      const { lastUpdated: lastUpdatedNew } = newState

      expect(lastUpdatedOld).not.toEqual(lastUpdatedNew)
      expect(selectTriggerTasksNotification(fullState)).toBe(true)
      expect(selectTasksList(fullState)).toEqual(tasks)
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
      const fullState = { entities: { tasks: newState } }

      const restOldState = omit(initialState, ['lastUpdated', 'items', 'order'])
      const restNewState = omit(newState, ['lastUpdated', 'items', 'order'])
      const { lastUpdated: lastUpdatedOld } = initialState
      const { lastUpdated: lastUpdatedNew } = newState

      expect(lastUpdatedOld).not.toEqual(lastUpdatedNew)
      expect(selectTasksList(fullState)).toEqual([{ id: 1 }, { id: 3, foo: 'bar', position: 1 }, { id: 2 }]);
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
      const fullState = { entities: { tasks: newState } }

      const restOldState = omit(initialState, ['lastUpdated', 'items', 'order'])
      const restNewState = omit(newState, ['lastUpdated', 'items', 'order'])
      const { lastUpdated: lastUpdatedOld } = initialState
      const { lastUpdated: lastUpdatedNew } = newState

      expect(lastUpdatedOld).not.toEqual(lastUpdatedNew)
      expect(selectTasksList(fullState)).toEqual([{ id: 1 }])
      expect(restOldState).toEqual(restNewState)
    })

    test(`${message} | unrecognized message type`, () => {
      const initialState = tasksEntityReducer(undefined, {})
      const newState = tasksEntityReducer(initialState, message({ type: 'fake' }))

      expect(newState).toEqual(initialState)
    })
  })
})
