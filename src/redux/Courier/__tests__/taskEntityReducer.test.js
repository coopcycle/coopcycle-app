import moment from 'moment'
import { omit } from 'lodash'
import { tasksEntityReducer } from '../taskEntityReducer'
import {
  loadTasksRequest, loadTasksFailure, loadTasksSuccess,
  markTaskDoneRequest, markTaskDoneFailure, markTaskDoneSuccess,
  markTaskFailedRequest, markTaskFailedFailure, markTaskFailedSuccess,
} from '../taskActions'
import {
  selectIsTasksLoading, selectIsTasksLoadingFailure, selectIsTaskCompleteFailure,
  selectTasks,
} from '../taskSelectors';
import { message } from '../../middlewares/WebSocketMiddleware'

// As we may be using setTimeout(), we need to mock timers
// @see https://jestjs.io/docs/en/timer-mocks.html
jest.useFakeTimers();

describe('Redux | Tasks | Reducers', () => {
  const initialState = tasksEntityReducer()

  describe('tasksEntityReducer', () => {
    [
      loadTasksRequest,
      markTaskDoneRequest,
      markTaskFailedRequest,
    ]
      .forEach((actionCreator) => {
        test(`${actionCreator}`, () => {
          const prevState = {
            ...initialState,
            fetchError: true,
          }
          const newState = tasksEntityReducer(prevState, actionCreator())
          const fullState = { entities: { tasks: newState } }

          const restOldState = omit(prevState, ['fetchError', 'isFetching'])
          const restNewState = omit(newState, ['fetchError', 'isFetching'])

          expect(restOldState).toEqual(restNewState)
          expect(selectIsTasksLoading(fullState)).toEqual(true)
          expect(selectIsTasksLoadingFailure(fullState)).toEqual(false)
        })
      });

    test(`${loadTasksFailure}`, () => {
      const error = new Error('test error')
      const prevState = {
        ...initialState,
        isFetching: true,
      }
      const newState = tasksEntityReducer(prevState, loadTasksFailure(error))
      const fullState = { entities: { tasks: newState } }

      const restOldState = omit(prevState, ['loadTasksFetchError', 'isFetching'])
      const restNewState = omit(newState, ['loadTasksFetchError', 'isFetching'])

      expect(restOldState).toEqual(restNewState)
      expect(selectIsTasksLoading(fullState)).toEqual(false)
      expect(selectIsTasksLoadingFailure(fullState)).toEqual(error)
    });

    [
      markTaskDoneFailure,
      markTaskFailedFailure,
    ]
      .forEach((actionCreator) => {
        test(`${actionCreator}`, () => {
          const error = new Error('test error')
          const prevState = {
            ...initialState,
            isFetching: true,
          }
          const newState = tasksEntityReducer(prevState, actionCreator(error))
          const fullState = { entities: { tasks: newState } }

          const restOldState = omit(prevState, ['completeTaskFetchError', 'isFetching'])
          const restNewState = omit(newState, ['completeTaskFetchError', 'isFetching'])

          expect(restOldState).toEqual(restNewState)
          expect(selectIsTasksLoading(fullState)).toEqual(false)
          expect(selectIsTaskCompleteFailure(fullState)).toEqual(error)
        })
      })

    test(`${loadTasksSuccess}`, () => {
      const tasks = [{ id: 1, assignedTo: 'bob' }, { id: 2, assignedTo: 'bob' }]
      const prevState = {
        ...initialState,
        loadTasksFetchError: true,
        isFetching: true,
      }
      const date = moment().format('YYYY-MM-DD')
      const newState = tasksEntityReducer(prevState, loadTasksSuccess(date, tasks))
      const fullState = { entities: { tasks: newState } }

      const restOldState = omit(prevState, ['loadTasksFetchError', 'isFetching', 'items'])
      const restNewState = omit(newState, ['loadTasksFetchError', 'isFetching', 'items'])

      expect(selectIsTasksLoading(fullState)).toBe(false)
      expect(selectIsTasksLoadingFailure(fullState)).toBe(false)
      expect(selectTasks(fullState)).toEqual(tasks)

      expect(restOldState).toEqual({ ...restNewState, date: '' })
    });

    [
      markTaskDoneSuccess,
      markTaskFailedSuccess,
    ]
      .forEach((actionCreator) => {
        test(`${actionCreator}`, () => {
          const task = { id: 1, foo: 'bar' }
          const date = moment().format('YYYY-MM-DD')
          const prevState = {
            ...initialState,
            date,
            items: {
              [ date ]: [ task ],
            }
          }

          const newState = tasksEntityReducer(prevState, actionCreator({ ...task, foo: 'foo' }))
          const fullState = { entities: { tasks: newState } }

          const restOldState = omit(prevState, ['items'])
          const restNewState = omit(newState, ['items'])
          const { isFetching } = newState

          expect(selectTasks(fullState)).toEqual([{ ...task, foo: 'foo' }]);

          expect(restOldState).toEqual(restNewState)
          expect(isFetching).toBeFalsy()
        })
      })

    test(`${message} | tasks:changed`, () => {
      const date = moment().format('YYYY-MM-DD')

      const tasks = [{ id: 1, position: 1 }, { id: 2, position: 0 }]
      const wsMsg = { type: 'tasks:changed', date, tasks }

      const prevState = {
        ...initialState,
        date,
      }

      const newState = tasksEntityReducer(prevState, message(wsMsg))
      const fullState = { entities: { tasks: newState } }

      const restOldState = omit(prevState, ['items'])
      const restNewState = omit(newState, ['items'])

      expect(selectTasks(fullState)).toEqual([ tasks[1], tasks[0] ])
      expect(restOldState).toEqual(restNewState)
    })

    test(`${message} | task:changed`, () => {
      const date = moment().format('YYYY-MM-DD')

      const oldTasks = [{ id: 1, position: 0 }, { id: 2, position: 1 }]
      const newTasks = [{ id: 1, position: 0 }, { id: 3, position: 1 }, { id: 2, position: 2 }]
      const wsMsg = { type: 'tasks:changed', date, tasks: newTasks }

      const prevState = {
        ...initialState,
        date,
        items: {
          [ date ]: oldTasks
        },
      }

      const newState = tasksEntityReducer(prevState, message(wsMsg))
      const fullState = { entities: { tasks: newState } }

      const restOldState = omit(prevState, ['items'])
      const restNewState = omit(newState, ['items'])

      expect(selectTasks(fullState)).toEqual(newTasks);
      expect(restOldState).toEqual(restNewState)
    })

    test(`${message} | unrecognized message type`, () => {
      const prevState = { ...initialState }
      const newState = tasksEntityReducer(prevState, message({ type: 'fake' }))

      expect(newState).toEqual(prevState)
    })
  })
})
