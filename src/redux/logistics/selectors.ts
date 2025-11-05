import { createSelector } from '@reduxjs/toolkit';
import { selectAllTasks, selectTaskLists } from '../../shared/logistics/redux';
import { Task } from '../../types/task';

export const selectTasksByOrder = (orderNumber: string) =>
  createSelector(selectAllTasks, all =>
    all.filter(t => t.metadata.order_number === orderNumber),
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

    const visible = [...ordered, ...allTasks.filter(t => !taskIndex.has(t['@id']))];

    // Group and sort by order_number + list position
    const tasksByOrder: Record<string, Task[]> = {};
    for (const task of visible) {
      const order = task.metadata?.order_number;
      if (!order) continue;
      (tasksByOrder[order] ??= []).push(task);
    }

    for (const order in tasksByOrder) {
      tasksByOrder[order].sort((a, b) => {
        const A = taskIndex.get(a['@id']);
        const B = taskIndex.get(b['@id']);
        if (A && B) return A[0] - B[0] || A[1] - B[1];
        if (A) return -1;
        if (B) return 1;
        return (a.id ?? 0) - (b.id ?? 0);
      });
    }

    return visible;
  },
);

// Tasks reordered for one order
export const selectIncomingTasksReordered = (orderNumber: string) =>
  createSelector(selectAllIncomingTasksReordered, tasks =>
    tasks.filter(t => t.metadata?.order_number === orderNumber),
  );
