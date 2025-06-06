import _ from 'lodash';
import moment from 'moment';
import { withLinkedTasks } from './taskUtils';
import { UNASSIGNED_TASKS_LIST_ID } from '../../constants';


export function replaceItemsWithItemIds(taskList) {
  let entity = {
    ...taskList,
  };

  entity.itemIds = taskList.items;
  delete entity.items;

  return entity;
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
  };
}

// NOTE: This function is only used from the function `getTasksListsToEdit`
// and is exported only to be able to test it.
export function withLinkedTasksForTaskList(orders, allTasks, allTaskLists) {
  return Object.values(orders).reduce((acc, taskListTasks) => {
    taskListTasks.forEach(task => {
      const allRelatedTasks = withLinkedTasks(task, allTasks);

      allRelatedTasks.forEach(relatedTask => {
        const foundRelatedTaskList = allTaskLists.find(
          taskList => taskList.items.map(t => t['@id']).includes(relatedTask['@id'])
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
