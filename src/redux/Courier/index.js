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
  DONT_TRIGGER_TASKS_NOTIFICATION,

  loadTasks, loadTasksRequest, loadTasksSuccess, loadTasksFailure,
  markTaskDone, markTaskDoneRequest, markTaskDoneSuccess, markTaskDoneFailure,
  markTaskFailed, markTaskFailedRequest, markTaskFailedSuccess, markTaskFailedFailure,
  dontTriggerTasksNotification,
} from './taskActions'
import {
  selectTaskSelectedDate,
  selectTriggerTasksNotification,
  selectIsTasksLoading,
  selectIsTasksLoadingFailure,
  selectTasks,
  selectTasksOrder,
  selectTasksList
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
  DONT_TRIGGER_TASKS_NOTIFICATION,

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
  dontTriggerTasksNotification,

  selectIsTasksLoading,
  selectIsTasksLoadingFailure,
  selectTasks,
  selectTasksOrder,
  selectTasksList,
  selectTaskSelectedDate,
  selectTriggerTasksNotification,
}
