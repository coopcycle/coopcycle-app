/**
 * Tasks Redux Fragment
 *
 * Exports action types, action creators, reducers and selectors related to the
 * Tasks in the application
 */
import { createSelector } from 'reselect'
import { tasksEntityReducer, tasksUiReducer } from './reducers'
import {
  LOAD_TASKS_REQUEST, LOAD_TASKS_FAILURE, LOAD_TASKS_SUCCESS,
  MARK_TASK_DONE_REQUEST, MARK_TASK_DONE_FAILURE, MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_REQUEST, MARK_TASK_FAILED_FAILURE, MARK_TASK_FAILED_SUCCESS,
  DONT_TRIGGER_TASKS_NOTIFICATION,

  loadTasks, loadTasksRequest, loadTasksSuccess, loadTasksFailure,
  markTaskDone, markTaskDoneRequest, markTaskDoneSuccess, markTaskDoneFailure,
  markTaskFailed, markTaskFailedRequest, markTaskFailedSuccess, markTaskFailedFailure,
  dontTriggerTasksNotification,
} from './actions'


/*
 * Selectors
 *
 * Selectors help decouple the shape of the state from the component code itself.
 * Here we use `reselect`, which allows us to memoize computed property values,
 * benefitting performance.
 */
const selectTaskSelectedDate = state => state.ui.tasks.selectedDate
const selectTriggerTasksNotification = state => state.entities.tasks.triggerTasksNotification
const selectIsTasksLoading = state => state.entities.tasks.isFetching
const selectIsTasksLoadingFailure = state => state.entities.tasks.fetchError
const selectTasks = state => state.entities.tasks
const selectTasksOrder = state => state.entities.tasks.order
const selectTasksList = createSelector(
  selectTasks,
  selectTasksOrder,
  (tasks, ids) => ids.map(id => tasks[id])
)


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
