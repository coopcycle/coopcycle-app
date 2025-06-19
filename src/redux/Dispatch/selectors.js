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

// TODO: move UI related state management to Shared folder
// const selectTaskFilters = state => state.ui.tasks.excludeFilters;

// TODO: Move to dispatch's selectors and use selectTaskFilters with "tags" eliminated (is not used in Dispatch)
export const selectFilteredUnassignedTasksNotCancelled = createSelector(
  selectUnassignedTasksNotCancelled,
  selectTaskFilters,
  (tasks, filters) => filterTasks(tasks, filters),
);


// TODO: Move to dispatch's selectors and use selectTaskFilters with "tags" eliminated (is not used in Dispatch)
export const selectFilteredTaskLists = createSelector(
  selectTaskLists,
  selectTaskFilters,
  (taskLists, filters) => {
    const filteredTaskLists = taskLists.map(taskList => {
      const filteredTaskList = {...taskList};
      filteredTaskList.items = filterTasks(taskList.items, filters);

      return filteredTaskList;
    });

    return filteredTaskLists;
  }
)