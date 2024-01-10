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
  LOAD_TASKS_FAILURE, LOAD_TASKS_REQUEST, LOAD_TASKS_SUCCESS,
  MARK_TASK_DONE_FAILURE,
  MARK_TASK_DONE_REQUEST, MARK_TASK_DONE_SUCCESS, MARK_TASK_FAILED_FAILURE,
  MARK_TASK_FAILED_REQUEST, MARK_TASK_FAILED_SUCCESS, START_TASK_SUCCESS,

  addPicture, addSignature, clearTasksFilter, deletePictureAt,
  deleteSignatureAt, filterTasks, loadTasks, loadTasksFailure,
  loadTasksRequest, loadTasksSuccess, markTaskDone, markTaskDoneFailure,
  markTaskDoneRequest, markTaskDoneSuccess,
  markTaskFailed, markTaskFailedFailure,
  markTaskFailedRequest,
  markTaskFailedSuccess,
  markTasksDone, markTasksDoneFailure,
  markTasksDoneRequest, markTasksDoneSuccess, setKeepAwake, setPolylineOn,
  setSignatureScreenFirst, setTasksChangedAlertSound,
  startTask, startTaskSuccess,
} from './taskActions'
import {
  selectAreDoneTasksHidden,
  selectAreFailedTasksHidden,
  selectFilteredTasks,
  selectIsTagHidden,
  selectIsTaskCompleteFailure,
  selectIsTasksLoading,
  selectIsTasksLoadingFailure,
  selectIsTasksRefreshing,
  selectKeepAwake,
  selectPictures,
  selectSignatureScreenFirst,
  selectSignatures,
  selectTagNames,
  selectTags,
  selectTaskSelectedDate,
  selectTasks,
  selectTasksChangedAlertSound,
  selectTasksWithColor,
  selectIsPolylineOn
} from './taskSelectors'


export {
  tasksEntityReducer,
  tasksUiReducer,

  LOAD_TASKS_REQUEST,
  LOAD_TASKS_FAILURE,
  LOAD_TASKS_SUCCESS,
  START_TASK_SUCCESS,
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
  markTasksDone,
  markTasksDoneRequest,
  markTasksDoneSuccess,
  markTasksDoneFailure,
  startTask,
  startTaskSuccess,
  filterTasks,
  clearTasksFilter,
  setTasksChangedAlertSound,
  setKeepAwake,
  setPolylineOn,
  setSignatureScreenFirst,
  addSignature,
  addPicture,
  deleteSignatureAt,
  deletePictureAt,

  selectIsTasksLoading,
  selectIsTasksRefreshing,
  selectIsTasksLoadingFailure,
  selectIsTaskCompleteFailure,
  selectTasks,
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
  selectTasksWithColor,
  selectIsPolylineOn
}
