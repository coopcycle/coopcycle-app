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

export function withLinkedTasksForTaskList(orders, allTaskLists, unassignedTasks) {
  return Object.keys(orders).reduce((acc, taskListId) => {
    const tasks = orders[taskListId];
    const taskList = allTaskLists.find(
      _taskList => _taskList['@id'] === taskListId,
    );
    // const bagOfTasks = [...unassignedTasks, ...(taskList?.items || [])]

    if (taskList) {
      acc[taskListId] = _.flatMap(tasks, task =>
        withLinkedTasks(task, (taskList.items || [])),
      );
    } else {
      unassignedTasks.find(
        unassignedTask => unassignedTask['@id']
      )
    }

    return acc;
    // {'admin': [], 'unn': [], 'afr': [] }

  }, {});
}

export function getTasksListsToEdit(selectedTasks, allTaskLists, unassignedTasks) {
  const ordersByTaskList = withLinkedTasksForTaskList(
    selectedTasks.orders,
    allTaskLists,
    unassignedTasks
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
