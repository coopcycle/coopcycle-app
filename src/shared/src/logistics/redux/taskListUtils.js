import _ from 'lodash';
import moment from 'moment';

import { darkGreyColor } from '../../../../styles/common';
import { groupLinkedTasks, withLinkedTasks } from './taskUtils';
import { UNASSIGNED_TASKS_LIST_ID } from '../../constants';


export function replaceItemsWithItemIds(taskList) {
  let entity = {
    ...taskList,
  };

  entity.itemIds = taskList.items;
  delete entity.items;

  return entity;
}

export function getTaskListTasks(taskList, tasksEntities) {
  if (taskList.items) {
    return taskList.items;
  }

  return taskList.tasksIds
    .map(taskId => tasksEntities[taskId])
    .filter(maybeTask => maybeTask);
}

export function createCurrentTaskList(items = []) {
  const username = 'current';
  const assignedItems = items.map(item => ({
    ...item,
    isAssigned: true,
    assignedTo: username,
  }));

  return createTempTaskList(username, assignedItems);
}

export function createTempTaskList(username, items = []) {
  return {
    '@context': '/api/contexts/TaskList',
    '@id': 'temp_' + username,
    '@type': 'TaskList',
    distance: 0,
    duration: 0,
    polyline: '',
    createdAt: moment().format(),
    updatedAt: moment().format(),
    username,
    items,
    tasksIds: items.map(item => item['@id']),
  };
}

export function createUnassignedTaskLists(allUnassignedTasks) {
  // Split the unassigned task list by grouped linked tasks
  const linkedTasks = groupLinkedTasks(allUnassignedTasks);

  const {unassignedTaskLists} = Object.entries(linkedTasks).reduce((acc, [taskId, linkedTaskIds]) => {
    if (linkedTaskIds.some((linkedTaskId) => acc.tasks[linkedTaskId] !== undefined)) {
      return acc; // These tasks were already linked to a tasklist
    }

    const tasks = linkedTaskIds.map(linkedTaskId => {
      // Update the task index
      acc.tasks[linkedTaskId] = taskId;
      // Return the task object with all its data
      return allUnassignedTasks.find(task => task['@id'] === linkedTaskId);
    });

    acc.unassignedTaskLists.push({
      '@id': `${UNASSIGNED_TASKS_LIST_ID}-${taskId}`,
      id: `${UNASSIGNED_TASKS_LIST_ID}-${taskId}`,
      items: tasks,
      tasksIds: tasks.map(task => task['@id']),
      color: darkGreyColor,
      // This property below will be used into the map view to show/hide unassigned tasks
      isUnassignedTaskList: true,
      // The one below is needed/used to search by username at getTaskTaskList->getUserTaskList functions
      username: null,
    });

    return acc;
  }, {tasks: {/*Just and index*/}, unassignedTaskLists: [/*The resultant task lists*/]});

  return unassignedTaskLists;
}

// NOTE: This function is only used from the function `getTasksListsToEdit`
// and is exported only to be able to test it.
export function withLinkedTasksForTaskList(orders, allTasks, allTaskLists) {
  return Object.values(orders).reduce((acc, taskListTasks) => {
    taskListTasks.forEach(task => {
      const allRelatedTasks = withLinkedTasks(task, allTasks);

      allRelatedTasks.forEach(relatedTask => {
        const foundRelatedTaskList = allTaskLists.find(
          taskList => taskList.tasksIds.includes(relatedTask['@id'])
        );
        const accKey = foundRelatedTaskList ? foundRelatedTaskList['@id'] : UNASSIGNED_TASKS_LIST_ID;
        acc[accKey] = (acc[accKey] || []).concat(relatedTask);
      });
    });

    return acc;
  }, {});
}

export function getTasksListsToEdit(selectedTasks, allTasks, allTaskLists) {
  const ordersByTaskList = withLinkedTasksForTaskList(
    selectedTasks.orders,
    allTasks,
    allTaskLists
  );
  const tasksByTaskList = selectedTasks.tasks;

  return _.mergeWith(ordersByTaskList, tasksByTaskList, (orders, tasks) => {
    return _.uniqBy([... (orders || []), ...(tasks || [])], '@id')
  });
}

export function getTasksListIdsToEdit(selectedTasks) {
  const ordersTasksListIds = Object.keys(selectedTasks.orders);
  const tasksTasksListIds = Object.keys(selectedTasks.tasks);

  return _.uniq([... ordersTasksListIds, ...tasksTasksListIds])
}

export function getLinkedTasks(task, taskListId, allTasks, allTaskLists) {
  return getTasksListsToEdit(
    {
      orders: {
        [taskListId]: [task]
      },
      tasks: {}
    },
    allTasks,
    allTaskLists
  );
};

export function getUserTaskList(username, allTaskLists) {
  return allTaskLists.find(taskList => taskList.username === username);
}

/**
 * Find the 1st task list that contains the task
 *
 * @param {Task} task - The task object to search for. Expected to have an '@id' property.
 * @param {Array<TaskList>} allTaskLists - An array of all task list objects to search through.
 * @returns {TaskList|undefined} The task list that contains the specified task, or undefined if not found.
*/
export function getTaskListByTask(task, allTaskLists) {
  return allTaskLists.find(taskList => (taskList.tasksIds || (taskList.items.map(t => t['@id'])) || []).find(id => id === task['@id']));
}

function getTaskListIdForTask(task, allTaskLists) {
  const taskList = getTaskListByTask(task, allTaskLists);
  const key = taskList ? taskList['@id'] : UNASSIGNED_TASKS_LIST_ID;

  return key;
}

// Precondition: all tasks and orders are from the same task list
export function buildSelectedTasks(orders, tasks, allTaskLists) {
  const baseResponse = {
    orders: {},
    tasks: {},
  };

  if (orders.length === 0 && tasks.length === 0) {
    return baseResponse;
  }

  if (orders.length > 0) {
    const key = getTaskListIdForTask(orders[0], allTaskLists);
    baseResponse.orders[key] = orders;
  }

  if (tasks.length > 0) {
    const key = getTaskListIdForTask(tasks[0], allTaskLists);
    baseResponse.tasks[key] = tasks;
  }

  return baseResponse;
}
