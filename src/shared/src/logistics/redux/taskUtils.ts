import _, { mapValues } from 'lodash';
import ColorHash from 'color-hash';
import moment from 'moment';

import { getUserTaskList } from './taskListUtils';
// WHEN TASK IS ADDED, uncomment the following line
// import { Task } from '../../../../types/Task';

/**
 * Utility function to sort a list of tasks
 * @param {Object} a - Task
 * @param {Object} b - Task
 */
export function tasksSort(a, b) {
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

export function groupLinkedTasks(tasks) {
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

export function withLinkedTasks(task, allTasks) {
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

export function mapToColor(tasks) {
  return mapValues(groupLinkedTasks(tasks), taskIds =>
    colorHash.hex(taskIds.join(' ')),
  );
}

export function getTasksWithColor(tasks) {
  const taskColors = mapToColor(tasks);

  return tasks.map(task => {
    return addColorToTask(task, taskColors);
  });
}

export function getTaskWithColor(task, tasks) {
  const taskId = task['@id'];
  const exists = tasks.some(t => t['@id'] === taskId);
  const allTasks = exists ? tasks : [...tasks, task];
  const taskColors = mapToColor(allTasks);

  return addColorToTask(task, taskColors);
}

function addColorToTask(task, taskColors) {
  const taskId = task['@id'];
  const color = task.color || taskColors[taskId] || '#ffffff';

  return {
    ...task,
    color,
  };
}

export function tasksToIds(tasks) {
  return tasks.map(item =>
    item['@type'] === 'TaskCollectionItem' ? item.task : item['@id'],
  );
}

export function getTaskListItemIds(username: string, allTaskLists) {
  const userTaskList = getUserTaskList(username, allTaskLists);

  return userTaskList ? userTaskList.itemIds : [];
}

export function getAssignedTask(task, username: string) {
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

export function filterTasksByKeyword(tasks, keyword: string) {
  if (!(keyword && keyword.length > 0)) {
    return tasks;
  }

  return tasks.filter(task => taskIncludesKeyword(task, keyword));
}

export function taskIncludesKeyword(task, keyword: string): boolean {
  return (
    standardIncludes(task.id, keyword) ||
    standardIncludes(task.assignedTo, keyword) ||
    standardIncludes(task.orgName, keyword) ||
    standardIncludes(task.metadata?.order_number, keyword) ||
    standardIncludes(task.address?.name, keyword) ||
    standardIncludes(task.address?.contactName, keyword) ||
    standardIncludes(task.address?.firstName, keyword) ||
    standardIncludes(task.address?.lastName, keyword) ||
    standardIncludes(task.address?.streetAddress, keyword) ||
    task.tags.reduce(
      (acc, tag) => acc || standardIncludes(tag.name, keyword),
      false
    )
  );
}

function standardIncludes(originalString: string, keyword: string) {
  if (!originalString) {
    return false;
  }

  return originalString.toLowerCase().includes(keyword.toLowerCase());
}

export function taskExists(list, task) {
  return list.some(t => t['@id'] === task['@id']);
}

export const getProcessedTasks = (tasks, isFromCourier: boolean = false) => {
  const tasksWithColor = getTasksWithColor(tasks);
  return displayPricePerOrder(tasksWithColor, isFromCourier);
};

export function displayPricePerOrder(tasks, isFromCourier: boolean) {
  const tasksWithOrderNumber = tasks.filter(
    t => t.metadata?.order_number !== undefined,
  );

  if (tasksWithOrderNumber.length === 0) {
    return tasks;
  }

  const tasksByOrder = groupTasksByOrder(tasksWithOrderNumber);
  const processedTasks = Object.values(tasksByOrder).map(
    (tasks) => processTasksOrderPrice(tasks, isFromCourier)
  );
  const flattenedTasks = processedTasks.flat();

  const processedMap = new Map(flattenedTasks.map(task => [task.id, task]));

  return tasks.map(task => {
    if (task.metadata?.order_number !== undefined) {
      return processedMap.get(task.id) || task;
    }
    return task;
  });
}

const groupTasksByOrder = (tasks): Record<string, []> => {
  return tasks.reduce((acc, task) => {
    const orderNumber = task.metadata.order_number;
    if (!acc[orderNumber]) {
      acc[orderNumber] = [];
    }
    acc[orderNumber].push(task);
    return acc;
  }, {});
};

const processTasksOrderPrice = (tasks, isFromCourier: boolean) => {
  if (hasMultipleTasksOfType(tasks, 'PICKUP')) {
    return applyOrderTotal(tasks, 'DROPOFF', isFromCourier);
  }

  if (hasMultipleTasksOfType(tasks, 'DROPOFF')) {
    return applyOrderTotal(tasks, isFromCourier ? 'DROPOFF' : 'PICKUP', isFromCourier);
  }

  return applyOrderTotal(tasks, 'DROPOFF', isFromCourier, true);
};

const hasMultipleTasksOfType = (
  tasks,
  type: Type,
): boolean => {
  return tasks.filter(t => t.type === type).length > 1;
};

const isSameTaskType = (task, type: Type) => {
  return task.type === type;
};

const applyOrderTotal = (
  tasks,
  type: Type,
  isCourier: boolean,
  isSingular: boolean = false,
) => {
  let hasKeptOrderTotal = false;

  return tasks.map(t => {
    const keepOrderTotal =
    isCourier
      ? isSameTaskType(t, 'DROPOFF')
      : isSameTaskType(t, type) && (!hasKeptOrderTotal || isSingular);
    const newTask = { ...t };

    if (keepOrderTotal) {
      hasKeptOrderTotal = true;
    } else {
      newTask.metadata = { ...newTask.metadata, order_total: null };
    }

    return newTask;
  });
};

interface Type {
  type: 'PICKUP' | 'DROPOFF',
}
