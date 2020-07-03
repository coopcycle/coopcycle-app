import { createSelector } from 'reselect'
import _ from 'lodash'
import {mapToColor} from "coopcycle-frontend-js";

export const selectUnassignedTask = createSelector(
  state => state.dispatch.unassignedTasks,
  (tasks) => _.filter(_.uniqBy(tasks, '@id'), task => task.status !== 'CANCELLED')
)

export const selectTasksNotCancelled = createSelector(
  state => state.tasks,
  (tasks) => _.filter(tasks, task => task.status !== 'CANCELLED')
)

export const selectTasksWithColor = createSelector(
  state => state.dispatch.allTasks,
  tasks => mapToColor(tasks)
)
