import { createSelector } from 'reselect';

import { filterTasks } from '../logistics/utils';
import { selectTaskFilters } from '../Courier/taskSelectors';
import {
  selectTaskLists,
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
  (taskLists) => {
    const filteredTaskLists = taskLists.map(taskList => {
      const filteredTaskList = {...taskList};
      filteredTaskList.items = filterTasks(taskList.items, filters);

      return filteredTaskList;
    });

    return filteredTaskLists;
  }
);

export const selectStringFilters = state => state.dispatch.ui.stringFilters;
