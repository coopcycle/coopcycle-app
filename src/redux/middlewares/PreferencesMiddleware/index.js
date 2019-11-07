import { ADD_TASK_FILTER, CLEAR_TASK_FILTER } from '../../Courier/taskActions'
import { selectTaskFilters } from '../../Courier/taskSelectors'
import Preferences from '../../../Preferences'

const middleware = store => next => action => {

  let result = next(action)

  switch (action.type) {
    case ADD_TASK_FILTER:
    case CLEAR_TASK_FILTER:

      const state = store.getState()
      Preferences.setTasksFilters(selectTaskFilters(state))

      break
  }

  return result
}

export default middleware
