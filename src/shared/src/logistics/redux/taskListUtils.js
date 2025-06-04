import _ from 'lodash';
import moment from 'moment';
import { withLinkedTasks } from './taskUtils';

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

export function withLinkedTasksForTaskList(orders, allTaskLists) {
  return Object.keys(orders).reduce((acc, taskListId) => {
    const tasks = orders[taskListId];
    const taskList = allTaskLists.find(
      _taskList => _taskList['@id'] === taskListId,
    );
    acc[taskListId] = _.flatMap(tasks, task =>
      withLinkedTasks(task, taskList.items),
    );
    return acc;
  }, {});
}

export function getTasksListsToEdit(selectedTasks, allTaskLists) {
  const ordersByTaskList = withLinkedTasksForTaskList(
    selectedTasks.orders,
    allTaskLists,
  );
  const tasksByTaskList = selectedTasks.tasks;

  return _.mergeWith(ordersByTaskList, tasksByTaskList, (orders, tasks) => {
    return _.uniqBy([... (orders || []), ...(tasks || [])], '@id')
  });
}
