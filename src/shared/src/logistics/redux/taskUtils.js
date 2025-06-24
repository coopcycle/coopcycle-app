import _, { mapValues } from 'lodash';
import ColorHash from 'color-hash';
import moment from 'moment';

import { getUserTaskList } from './taskListUtils';


/**
 * Utility function to sort a list of tasks
 * @param {Object} a - Task
 * @param {Object} b - Task
 */
export function tasksSort(a, b) {
  if (moment(a.before).isSame(b.before) && a.type === 'PICKUP') {
    return -1
  } else {
    // put on top of the list the tasks that have an end of delivery window that finishes sooner
    return moment(a.before).isBefore(b.before) ? -1 : 1
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

  if (Object.prototype.hasOwnProperty.call(groups, task['@id'])) {
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

export function withUnassignedLinkedTasks(task, allTasks) {
  return withLinkedTasks(task, allTasks).filter(t => !t.assignedTo)
}

export function withAssignedLinkedTasks(task, allTasks) {
  return withLinkedTasks(task, allTasks).filter(t => t.assignedTo)
}

export function mapToColor(tasks) {
  return mapValues(groupLinkedTasks(tasks), taskIds =>
    colorHash.hex(taskIds.join(' ')),
  );
}

export function tasksToIds(tasks) {
  return tasks.map(item =>
    item['@type'] === 'TaskCollectionItem' ? item.task : item['@id'],
  );
}

export function getTaskListItems(username, allTaskLists) {
  const userTaskList = getUserTaskList(username, allTaskLists);

  return userTaskList ? userTaskList.items : [];
}

export function getTaskListItemIds(username, allTaskLists) {
  const userTaskList = getUserTaskList(username, allTaskLists);

  return userTaskList ? userTaskList.itemIds : [];
}

export function getAssignedTask(task, username) {
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
      acc[tourId] = (acc[tourId] || toursTasksIndex.tours[tourId]).filter(tourTaskId => tourTaskId !== taskId);
    }
    return acc;
  }, {});

  return toursToUpdate;
}

export function filterTasksByKeyword(tasks, keyword) {
  if (keyword === '') {
    return tasks;
  }

  return tasks.filter(task => taskIncludesKeyword(task, keyword) || taskIncludesKeywordInOrder(task, keyword));
}

export function taskIncludesKeyword(task, keyword) {
  return standardIncludes(task.assignedTo, keyword)
    || standardIncludes(task.orgName, keyword)
    || task.tags.reduce((acc, tag) => acc || standardIncludes(tag.name, keyword), false);
}

export function taskIncludesKeywordInOrder(task, keyword) {
  return standardIncludes(task.metadata?.order_number, keyword)
    || standardIncludes(task.address?.contactName, keyword)
    || standardIncludes(task.address?.firstName, keyword)
    || standardIncludes(task.address?.lastName, keyword)
    || standardIncludes(task.address?.name, keyword)
    || standardIncludes(task.address?.streetAddress, keyword)
}

function standardIncludes(originalString, keyword) {
  if (!originalString) {
    return false;
  }

  const lowercaseKeyword = keyword.toLowerCase();

  return originalString.toLowerCase().includes(lowercaseKeyword);
}
