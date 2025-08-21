import _, { mapValues } from 'lodash';
import ColorHash from 'color-hash';
import moment from 'moment';

import { getUserTaskList } from './taskListUtils';
import { getTaskTitle } from '../../utils';
import { Task } from '../../../../types/Task';

/**
 * Utility function to sort a list of tasks
 * @param {Object} a - Task
 * @param {Object} b - Task
 */
export function tasksSort(a: Task, b: Task) {
  if (
    a.metadata?.order_number &&
    b.metadata?.order_number &&
    a.metadata?.order_number === b.metadata?.order_number
  ) {
    return a.metadata.delivery_position - b.metadata.delivery_position;
  }

  if (moment(a.before).isSame(b.before) && a.type === 'PICKUP') {
    return -1;
  } else {
    // put on top of the list the tasks that have an end of delivery window that finishes sooner
    return moment(a.before).isBefore(b.before) ? -1 : 1;
  }
}

const colorHash = new ColorHash();

export function groupLinkedTasks(tasks: Task[]) {
  const copy = tasks.slice(0);

  const groups = {};

  while (copy.length > 0) {
    const task = copy.shift();

    if (task.previous) {
      const prevTask = _.find(tasks, t => t['@id'] === task.previous);

      if (prevTask) {
        if (groups[prevTask['@id']]) {
          const newIris = _.reduce(
            groups[prevTask['@id']],
            function (result, value) {
              return result.concat([value]);
            },
            [task['@id']],
          );

          newIris.forEach(iri => {
            groups[iri] = newIris;
          });
        } else {
          groups[task['@id']] = [prevTask['@id'], task['@id']];
          groups[prevTask['@id']] = [prevTask['@id'], task['@id']];
        }
      }
    }
  }

  return mapValues(groups, value => {
    return value.sort(); // sort by task id useless if the dropoff was created before the pickup
  });
}

export function withLinkedTasks(task: Task, allTasks: Task[]) {
  const groups = groupLinkedTasks(allTasks);
  const newTasks = [];

  if (groups[task['@id']]) {
    groups[task['@id']].forEach(taskId => {
      const t = _.find(allTasks, t => t['@id'] === taskId);
      newTasks.push(t);
    });
  } else {
    // task with no linked tasks
    newTasks.push(task);
  }
  return newTasks.sort(tasksSort);
}

export function mapToColor(tasks: Task[]) {
  return mapValues(groupLinkedTasks(tasks), taskIds =>
    colorHash.hex(taskIds.join(' ')),
  );
}

export function getTasksWithColor(tasks: Task[]) {
  const taskColors = mapToColor(tasks);

  return tasks.map((task: Task) => {
    return addColorToTask(task, taskColors);
  });
}

export function getTaskWithColor(task: Task, tasks: Task[]) {
  const taskId = task['@id'];
  const exists = tasks.some(t => t['@id'] === taskId);
  const allTasks = exists ? tasks : [...tasks, task];
  const taskColors = mapToColor(allTasks);

  return addColorToTask(task, taskColors);
}

function addColorToTask(task: Task, taskColors) {
  const taskId = task['@id'];
  const color = task.color || taskColors[taskId] || '#ffffff';

  return {
    ...task,
    color,
  };
}

export function tasksToIds(tasks: Task[]) {
  return tasks.map(item =>
    item['@type'] === 'TaskCollectionItem' ? item.task : item['@id'],
  );
}

export function getTaskListItemIds(username: string, allTaskLists: Task[]) {
  const userTaskList = getUserTaskList(username, allTaskLists);

  return userTaskList ? userTaskList.itemIds : [];
}

export function getAssignedTask(task: Task, username: string) {
  return {
    ...task,
    isAssigned: !!username,
    assignedTo: username,
  };
}

export function getToursToUpdate(itemIds, toursTasksIndex) {
  const toursToUpdate = itemIds.reduce((acc, taskId) => {
    const tourId = toursTasksIndex.tasks[taskId];
    if (tourId) {
      // Initialize with all the indexed tour tasks if not already present
      // and remove the taskId from the tour tasks
      acc[tourId] = (acc[tourId] || toursTasksIndex.tours[tourId]).filter(
        tourTaskId => tourTaskId !== taskId,
      );
    }
    return acc;
  }, {});

  return toursToUpdate;
}

export function filterTasksByKeyword(tasks: Task[], keyword: string) {
  if (keyword === '') {
    return tasks;
  }

  return tasks.filter(
    task =>
      taskIncludesKeyword(task, keyword) ||
      taskIncludesKeywordInOrder(task, keyword),
  );
}

export function taskIncludesKeyword(task: Task, keyword: string) {
  return (
    standardIncludes(task.assignedTo, keyword) ||
    standardIncludes(task.orgName, keyword) ||
    standardIncludes(getTaskTitle(task), keyword) ||
    task.tags.reduce(
      (acc, tag) => acc || standardIncludes(tag.name, keyword),
      false,
    )
  );
}

export function taskIncludesKeywordInOrder(task: Task, keyword: string) {
  return (
    standardIncludes(task.metadata?.order_number, keyword) ||
    standardIncludes(task.address?.contactName, keyword) ||
    standardIncludes(task.address?.firstName, keyword) ||
    standardIncludes(task.address?.lastName, keyword) ||
    standardIncludes(task.address?.name, keyword) ||
    standardIncludes(task.address?.streetAddress, keyword)
  );
}

function standardIncludes(originalString: string, keyword: string) {
  if (!originalString) {
    return false;
  }

  const lowercaseKeyword = keyword.toLowerCase();

  return originalString.toLowerCase().includes(lowercaseKeyword);
}
export function taskExists(list: Task[], task: Task) {
  return list.some(t => t['@id'] === task['@id']);
}

export const getProcessedCourierOrders = (tasks: Task[]) => {
  const tasksWithColor = getTasksWithColor(tasks);
  return displayPricePerOrder(tasksWithColor);
};

/**
 *
 * @param tasks Task[]
 * @returns Task[]
 */
export function displayPricePerOrder(tasks: Task[]): Task[] {
  const tasksByOrder = groupTasksByOrder(tasks);
  const processedOrders = Object.values(tasksByOrder).map(processOrder);
  return processedOrders.flat();
}

const groupTasksByOrder = (tasks: Task[]): Record<string, Task[]> => {
  return tasks.reduce((acc: any, task: Task) => {
    const orderNumber = task.metadata.order_number;
    if (!acc[orderNumber]) {
      acc[orderNumber] = [];
    }
    acc[orderNumber].push(task);
    return acc;
  }, {});
};

const processOrder = (order: Task[]): Task[] => {
  if (hasMultipleTasksOfType(order, 'PICKUP')) {
    return setOrderTotal(order, 'DROPOFF');
  }
  if (hasMultipleTasksOfType(order, 'DROPOFF')) {
    return setOrderTotal(order, 'PICKUP');
  }
  return order;
};

const setOrderTotal = (
  order: Task[],
  type: 'PICKUP' | 'DROPOFF',
): Task[] => {
  let isFirstTaskOfType = false;
  return order.map(t => {
    const shouldKeepOrderTotal = isSameTaskType(t, type) && !isFirstTaskOfType;
    const newTask = { ...t };
    if (shouldKeepOrderTotal) {
      isFirstTaskOfType = true;
      return newTask;
    } else {
      newTask.metadata = { ...newTask.metadata, order_total: null };
    }
    return newTask;
  });
};

const hasMultipleTasksOfType = (
  order: Task[],
  type: 'PICKUP' | 'DROPOFF',
): boolean => {
  return order.filter(t => t.type === type).length > 1;
};

const isSameTaskType = (task: Task, type: 'PICKUP' | 'DROPOFF') => {
  return task.type === type;
}
