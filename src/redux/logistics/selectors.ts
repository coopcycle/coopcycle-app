import { createSelector } from '@reduxjs/toolkit';
import { selectAllTasks, selectTaskLists } from '../../shared/logistics/redux';
import { Task } from '../../types/task';

export const selectTasksByOrder = (orderNumber: string) =>
  createSelector(selectAllTasks, tasks =>
    tasks.filter(t => t.metadata.order_number === orderNumber),
  );

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

// Tasks reordered for one order
export const selectIncomingTasksReordered = (orderNumber: string) =>
  createSelector(selectAllIncomingTasksReordered, tasks =>
    tasks.filter(t => t.metadata?.order_number === orderNumber),
  );
