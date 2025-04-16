export * from './adapters';
export { default as dateReducer } from './dateReducer';
export { default as taskEntityReducers } from './taskEntityReducers';
export { default as taskListEntityReducers } from './taskListEntityReducers';
export { default as uiReducers } from './uiReducers';

export {
  makeSelectTaskListItemsByUsername,
  selectAllTasks,
  selectAssignedTasks,
  selectSelectedDate,
  selectTaskLists,
  selectTasksWithColor,
  selectToursTasksIndex,
  selectUnassignedTasks,
} from './selectors';

export * from './actions';

import { groupLinkedTasks, mapToColor, tasksToIds } from './taskUtils';

export const taskUtils = {
  mapToColor,
  tasksToIds,
  groupLinkedTasks,
};

import { assignedTasks, replaceItemsWithItemIds } from './taskListUtils';

export const taskListUtils = {
  replaceItemsWithItemIds,
  assignedTasks,
};

import {
  findTaskListByTask,
  findTaskListByUsername,
} from './taskListEntityUtils';

export const taskListEntityUtils = {
  findTaskListByTask,
  findTaskListByUsername,
};
