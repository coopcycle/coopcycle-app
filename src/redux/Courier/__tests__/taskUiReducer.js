import { omit } from 'lodash'
import moment from 'moment'
import { tasksUiReducer } from '../taskUiReducer'
import { loadTasksRequest } from '../taskActions'
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
})
