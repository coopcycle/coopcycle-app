/**
 * Courier Redux Fragment
 *
 * Exports action types, action creators, reducers and selectors related to the
 * Courier in the application
 *
 * Currently just courier tasks
 */
import { tasksEntityReducer } from './taskEntityReducer'
import { tasksUiReducer } from './taskUiReducer'
import {
  LOAD_TASKS_REQUEST, LOAD_TASKS_FAILURE, LOAD_TASKS_SUCCESS,
  MARK_TASK_DONE_REQUEST, MARK_TASK_DONE_FAILURE, MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_REQUEST, MARK_TASK_FAILED_FAILURE, MARK_TASK_FAILED_SUCCESS,

  loadTasks, loadTasksRequest, loadTasksSuccess, loadTasksFailure,
  markTaskDone, markTaskDoneRequest, markTaskDoneSuccess, markTaskDoneFailure,
  markTaskFailed, markTaskFailedRequest, markTaskFailedSuccess, markTaskFailedFailure,
  startTask,
  filterTasks, clearTasksFilter,
  setTasksChangedAlertSound,
  setKeepAwake, setSignatureScreenFirst,
  uploadSignature,
  addPicture, addSignature,
  deleteSignatureAt, deletePictureAt,
} from './taskActions'
import {
  selectTaskSelectedDate,
  selectIsTasksLoading,
  selectIsTasksRefreshing,
  selectIsTasksLoadingFailure,
  selectIsTaskCompleteFailure,
  selectTasks,
  selectTasksList,
  selectFilteredTasks,
  selectAreDoneTasksHidden,
  selectAreFailedTasksHidden,
  selectTasksChangedAlertSound,
  selectTags,
  selectTagNames,
  selectIsTagHidden,
  selectKeepAwake,
  selectSignatures,
  selectPictures,
  selectSignatureScreenFirst,
} from './taskSelectors'


export {
  tasksEntityReducer,
  tasksUiReducer,

  LOAD_TASKS_REQUEST,
  LOAD_TASKS_FAILURE,
  LOAD_TASKS_SUCCESS,
  MARK_TASK_DONE_REQUEST,
  MARK_TASK_DONE_FAILURE,
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_REQUEST,
  MARK_TASK_FAILED_FAILURE,
  MARK_TASK_FAILED_SUCCESS,

  loadTasks,
  loadTasksRequest,
  loadTasksSuccess,
  loadTasksFailure,
  markTaskDone,
  markTaskDoneRequest,
  markTaskDoneSuccess,
  markTaskDoneFailure,
  markTaskFailed,
  markTaskFailedRequest,
  markTaskFailedSuccess,
  markTaskFailedFailure,
  startTask,
  filterTasks,
  clearTasksFilter,
  setTasksChangedAlertSound,
  setKeepAwake,
  setSignatureScreenFirst,
  uploadSignature,
  addSignature,
  addPicture,
  deleteSignatureAt,
  deletePictureAt,

  selectIsTasksLoading,
  selectIsTasksRefreshing,
  selectIsTasksLoadingFailure,
  selectIsTaskCompleteFailure,
  selectTasks,
  selectTasksList,
  selectTaskSelectedDate,
  selectFilteredTasks,
  selectAreDoneTasksHidden,
  selectAreFailedTasksHidden,
  selectTasksChangedAlertSound,
  selectTags,
  selectTagNames,
  selectIsTagHidden,
  selectKeepAwake,
  selectSignatures,
  selectPictures,
  selectSignatureScreenFirst,
}
