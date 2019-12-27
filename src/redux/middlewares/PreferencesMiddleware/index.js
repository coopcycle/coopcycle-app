import {
    ADD_TASK_FILTER,
    CLEAR_TASK_FILTER,
    SET_SIGNATURE_SCREEN_FIRST,
} from '../../Courier/taskActions'
import { selectTaskFilters, selectSignatureScreenFirst } from '../../Courier/taskSelectors'
import Preferences from '../../../Preferences'

const middleware = store => next => action => {

  const result = next(action)

  switch (action.type) {
    case ADD_TASK_FILTER:
    case CLEAR_TASK_FILTER:
      Preferences.setTasksFilters(selectTaskFilters(store.getState()))
      break

    case SET_SIGNATURE_SCREEN_FIRST:
      Preferences.setSignatureScreenFirst(selectSignatureScreenFirst(store.getState()))
      break
  }

  return result
}

export default middleware
