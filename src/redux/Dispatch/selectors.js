import { createSelector } from 'reselect';

import { filterTasks } from '../logistics/utils';
import { getTaskListTasks } from '../../shared/src/logistics/redux/taskListUtils';
import { selectTaskFilters } from '../Courier/taskSelectors';
import {
  selectTaskLists,
  selectTasksEntities,
  selectUnassignedTasksNotCancelled,
} from '../../shared/logistics/redux';


export const selectIsDispatchFetching = createSelector(
  state => state.logistics.ui.isAssigningTasks,
  state => state.logistics.ui.isFetching,
  state => state.logistics.ui.taskListsLoading,
  (isAssigningTasks, isFetching, taskListsLoading) => isAssigningTasks || isFetching || taskListsLoading,
);

// use selectTaskFilters with "tags" eliminated (is not used in Dispatch)
export const selectDispatchUiTaskFilters = createSelector(
  selectTaskFilters,
  taskFilters => taskFilters.filter(taskFilter => !Object.keys(taskFilter).includes('tags'))
);

export const selectFilteredUnassignedTasksNotCancelled = filters => createSelector(
  selectUnassignedTasksNotCancelled,
  (tasks) => filterTasks(tasks, filters),
);

export const selectFilteredTaskLists = filters => createSelector(
  selectTaskLists,
  selectTasksEntities,
  (taskLists, taskEntities) => {
    const filteredTaskLists = taskLists.map(taskList => {
      const filteredTaskList = {...taskList};

      const tasks = getTaskListTasks(taskList, taskEntities);
      const filteredTasks = filterTasks(tasks, filters);
      filteredTaskList.tasksIds = filteredTasks.map(task => task['@id']);

      return filteredTaskList;
    });

    return filteredTaskLists;
  }
);

export const selectKeywordFilters = state => state.dispatch.ui.keywordFilters;
