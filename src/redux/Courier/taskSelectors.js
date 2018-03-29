/*
 * Selectors
 *
 * Selectors help decouple the shape of the state from the component code itself.
 * Here we use `reselect`, which allows us to memoize computed property values,
 * benefitting performance.
 */
import { createSelector } from 'reselect'

export const selectTaskSelectedDate = state => state.ui.tasks.selectedDate
export const selectTriggerTasksNotification = state => state.entities.tasks.triggerTasksNotification
export const selectIsTasksLoading = state => state.entities.tasks.isFetching
export const selectIsTasksLoadingFailure = state => state.entities.tasks.fetchError
export const selectTasks = state => state.entities.tasks.items
export const selectTasksOrder = state => state.entities.tasks.order
export const selectTasksList = createSelector(
  selectTasks,
  selectTasksOrder,
  (tasks, ids) => ids.map(id => tasks[id])
)
