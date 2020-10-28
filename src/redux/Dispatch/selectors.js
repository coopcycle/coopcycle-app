import { createSelector } from 'reselect'
import _ from 'lodash'
import { selectUnassignedTasks } from '../../coopcycle-frontend-js/lastmile/redux'

export const selectUnassignedTasksNotCancelled = createSelector(
  selectUnassignedTasks,
  (tasks) => _.filter(_.uniqBy(tasks, '@id'), task => task.status !== 'CANCELLED')
)

export const selectTasksNotCancelled = createSelector(
  state => state.tasks,
  (tasks) => _.filter(tasks, task => task.status !== 'CANCELLED')
)

export const selectIsDispatchFetching = createSelector(
  state => state.lastmile.ui.isFetching,
  state => state.lastmile.ui.taskListsLoading,
  (isFetching, taskListsLoading) => isFetching || taskListsLoading
)
