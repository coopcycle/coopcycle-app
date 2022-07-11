import { omit } from 'lodash'
import moment from 'moment'
import { tasksUiReducer } from '../taskUiReducer'
import { clearTasksFilter, filterTasks, loadTasksRequest } from '../taskActions'

describe('Redux | Tasks | Reducers', () => {
  describe('tasksUiReducer', () => {
    const initialState = tasksUiReducer()

    test(`${loadTasksRequest}`, () => {
      const now = moment()
      const then = now.subtract(1, 'hour')
      const prevState = {
        ...initialState,
        selectedDate: then,
      }

      const newState = tasksUiReducer(prevState, loadTasksRequest(now))
      const restOldState = omit(prevState, ['selectedDate'])
      const restNewState = omit(newState, ['selectedDate'])

      expect(newState).toEqual(expect.objectContaining({
        selectedDate: now,
      }))
      expect(restOldState).toEqual(restNewState)
    })

    test(`${filterTasks}`, () => {
      const prevState = {
        ...initialState,
      }

      const newState = tasksUiReducer(prevState, filterTasks({ status: 'TODO' }))
      const restOldState = omit(prevState, ['excludeFilters'])
      const restNewState = omit(newState, ['excludeFilters'])

      expect(newState).toEqual(expect.objectContaining({
        excludeFilters: [{ status: 'TODO' }],
      }))
      expect(restOldState).toEqual(restNewState)
    })

    test(`${clearTasksFilter} | Clear all filters`, () => {
      const prevState = {
        ...initialState,
        excludeFilters: [{ status: 'TODO' }, { tags: 'Important' }],
      }

      const newState = tasksUiReducer(prevState, clearTasksFilter())
      const restOldState = omit(prevState, ['excludeFilters'])
      const restNewState = omit(newState, ['excludeFilters'])

      expect(newState).toEqual(expect.objectContaining({ excludeFilters: [] }))
      expect(restOldState).toEqual(restNewState)
    })

    test(`${clearTasksFilter} | Clear single filter`, () => {
      const prevState = {
        ...initialState,
        excludeFilters: [{ status: 'TODO' }, { tags: 'Important' }],
      }

      const newState = tasksUiReducer(prevState, clearTasksFilter({ tags: 'Important' }))
      const restOldState = omit(prevState, ['excludeFilters'])
      const restNewState = omit(newState, ['excludeFilters'])

      expect(newState).toEqual(expect.objectContaining({ excludeFilters: [{ status: 'TODO' }] }))
      expect(restOldState).toEqual(restNewState)
    })
  })
})
