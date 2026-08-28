import { createSelector } from '@reduxjs/toolkit';
import { selectAllTasks, selectTaskLists } from '../../shared/logistics/redux';
import { Task } from '../../types/task';
import { indexTasksByOrder } from './utils';

// Shared empty result, so selectors returning "nothing" keep a stable
// reference and don't re-render their subscribers.
const EMPTY_TASKS: Task[] = [];

export const selectAllTasksIndexedByOrder = createSelector(
  selectAllTasks,
  indexTasksByOrder,
);

/**
 * Returns a plain lookup, *not* a factory of memoized selectors — see the note
 * on `selectFilteredTasksByOrder` in `redux/Courier/taskSelectors`.
 */
export const selectTasksByOrder = (orderNumber: string) => state =>
  selectAllTasksIndexedByOrder(state).get(orderNumber) ?? EMPTY_TASKS;

// Reorder tasks by their position in taskLists
export const selectAllIncomingTasksReordered = createSelector(
  selectTaskLists,
  selectAllTasks,
  (taskLists, allTasks) => {
    const tasksById = new Map(allTasks.map(t => [t['@id'], t]));
    const taskIndex = new Map<string, [number, number]>();
    const ordered: Task[] = [];

    taskLists.forEach((list, li) => {
      list.tasksIds?.forEach((id, pi) => {
        const task = tasksById.get(id);
        if (task) {
          ordered.push(task);
          taskIndex.set(id, [li, pi]);
        }
      });
    });

    return [...ordered, ...allTasks.filter(t => !taskIndex.has(t['@id']))];
  },
);

export const selectIncomingTasksReorderedIndexedByOrder = createSelector(
  selectAllIncomingTasksReordered,
  indexTasksByOrder,
);

// Tasks reordered for one order
export const selectIncomingTasksReordered = (orderNumber: string) => state =>
  selectIncomingTasksReorderedIndexedByOrder(state).get(orderNumber) ??
  EMPTY_TASKS;
