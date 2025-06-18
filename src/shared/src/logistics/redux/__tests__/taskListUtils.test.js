import _ from 'lodash';

import {
  buildSelectedTasks,
  getTasksListIdsToEdit,
  getTasksListsToEdit,
  replaceItemsWithItemIds,
  withLinkedTasksForTaskList,
} from '../taskListUtils.js';
import { getTaskListWithItems, getTaskWithPrevious } from '../testsUtils.js';


const usernames = [
  'username0',
  'username1',
  'username2',
  'username3',
  'username4',
  'username5',
  'username6',
];

const getTaskWithPreviousWithUsernames = getTaskWithPrevious(usernames);
const getTaskListWithItemsWithUsernames = getTaskListWithItems(usernames);

const allTasks = [
  getTaskWithPreviousWithUsernames(0, 1),
  getTaskWithPreviousWithUsernames(1, 2),
  getTaskWithPreviousWithUsernames(2, 2, 1),
  getTaskWithPreviousWithUsernames(3, 3),
  getTaskWithPreviousWithUsernames(4, 3, 3),
  getTaskWithPreviousWithUsernames(5, 3, 4),
  getTaskWithPreviousWithUsernames(6, 4, 5),
  getTaskWithPreviousWithUsernames(7, 4, 6),
  getTaskWithPreviousWithUsernames(8, 5),
  getTaskWithPreviousWithUsernames(9, 6, 8),
  getTaskWithPreviousWithUsernames(10, null, 9)
];

const allTaskLists = [
  getTaskListWithItemsWithUsernames(0, []),
  getTaskListWithItemsWithUsernames(1, [allTasks[0]]),
  getTaskListWithItemsWithUsernames(2, [allTasks[1], allTasks[2]]),
  getTaskListWithItemsWithUsernames(3, [allTasks[3], allTasks[4], allTasks[5]]),
  getTaskListWithItemsWithUsernames(4, [allTasks[6], allTasks[7]]),
  getTaskListWithItemsWithUsernames(5, [allTasks[8]]),
  getTaskListWithItemsWithUsernames(6, [allTasks[9]]),
];

function normalizeTasksListIdsToEdit(tasksListIdsToEdit) {
  return Object.keys(tasksListIdsToEdit).reduce(
    (res, key) => {
      res[key] = _.sortBy([...tasksListIdsToEdit[key]], '@id');
      return res;
    },
    {}
  );
}

describe('taskListUtils', () => {
  describe('replaceItemsWithItemIds', () => {
    it('should remove items and add itemIds in a task list', () => {
      const taskList = {
        '@id': '/api/task_lists/1',
        username: 'bot_1',
        items: ['/api/tasks/1', '/api/tasks/2'],
      };

      const result = replaceItemsWithItemIds(taskList);

      expect(result).toEqual({
        '@id': '/api/task_lists/1',
        username: 'bot_1',
        itemIds: ['/api/tasks/1', '/api/tasks/2'],
      });
      expect(result).not.toBe(taskList);
    });
  });

  describe('withLinkedTasksForTaskList', () => {
    it('should return an empty object if no orders selected', () => {
      const orders = {};
      const result = withLinkedTasksForTaskList(orders, allTasks, allTaskLists);

      expect(result).toEqual({});
    });

    it('should return an object with tasks for taskLists with no related tasks', () => {
      const orders = {
        '/api/task_lists/1': [allTasks[0]],
      };

      const result = withLinkedTasksForTaskList(orders, allTasks, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/1': [allTasks[0]],
      });
    });

    it('should return an object with tasks for one taskLists with related tasks', () => {
      const orders = {
        '/api/task_lists/3': [allTasks[4]],
      };

      const result = withLinkedTasksForTaskList(orders, allTasks, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
        '/api/task_lists/4': [allTasks[6], allTasks[7]]
      });
    });

    it('should return an object with tasks for two taskLists with related tasks', () => {
      const orders = {
        '/api/task_lists/2': [allTasks[2]],
        '/api/task_lists/3': [allTasks[4]],
      };

      const result = withLinkedTasksForTaskList(orders, allTasks, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/2': [allTasks[1], allTasks[2]],
        '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
        '/api/task_lists/4': [allTasks[6], allTasks[7]]
      });
    });

    it('should return an object with tasks for taskList including unassigned', () => {
      const orders = {
        '/api/task_lists/5': [allTasks[8]]
      };

      const result = withLinkedTasksForTaskList(orders, allTasks, allTaskLists);

      expect(result).toEqual({
        'UNASSIGNED_TASKS_LIST': [allTasks[10]],
        '/api/task_lists/5': [allTasks[8]],
        '/api/task_lists/6': [allTasks[9]]
      });

      const orders2 = {
        '/api/task_lists/6': [allTasks[9]]
      };
      const result2 = withLinkedTasksForTaskList(orders2, allTasks, allTaskLists);
      expect(result2).toEqual(result);

      const orders3 = {
        'UNASSIGNED_TASKS_LIST': [allTasks[10]]
      };
      const result3 = withLinkedTasksForTaskList(orders3, allTasks, allTaskLists);
      expect(result3).toEqual(result);
    });
  });

  describe('getTasksListsToEdit', () => {
    it('should return an empty object when nothing has been selected', () => {
      const selectedTasks = {
        orders: {},
        tasks: {},
      };

      const result = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);

      expect(normalizeTasksListIdsToEdit(result)).toEqual({});
    });

    it('should return an object with tasks of just one taskLists', () => {
      const selectedTasks = {
        orders: {},
        tasks: {
          '/api/task_lists/2': [allTasks[1], allTasks[2]],
        },
      };

      const result = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);

      expect(normalizeTasksListIdsToEdit(result)).toEqual(normalizeTasksListIdsToEdit({
        '/api/task_lists/2': [allTasks[1], allTasks[2]],
      }));
    });

    it('should return an object with tasks order by taskLists', () => {
      const selectedTasks = {
        orders: {},
        tasks: {
          '/api/task_lists/1': [allTasks[0]],
          '/api/task_lists/2': [allTasks[1], allTasks[2]],
          '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
        },
      };

      const result = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);

      expect(normalizeTasksListIdsToEdit(result)).toEqual(normalizeTasksListIdsToEdit({
        '/api/task_lists/1': [allTasks[0]],
        '/api/task_lists/2': [allTasks[1], allTasks[2]],
        '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
      }));
    });

    it('should return an object with several orders tasks by taskLists with related tasks', () => {
      const selectedTasks = {
        orders: {
          '/api/task_lists/2': [allTasks[2]],
          '/api/task_lists/3': [allTasks[4]],
        },
        tasks: {},
      };

      const result = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);

      expect(normalizeTasksListIdsToEdit(result)).toEqual(normalizeTasksListIdsToEdit({
        '/api/task_lists/2': [allTasks[1], allTasks[2]],
        '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
        '/api/task_lists/4': [allTasks[6], allTasks[7]],
      }));
    });

    it('should return an object with several orders tasks by taskLists with related tasks and tasks', () => {
      const selectedTasks = {
        orders: {
          '/api/task_lists/1': [allTasks[0]],
          '/api/task_lists/3': [allTasks[4]],
        },
        tasks: {
          '/api/task_lists/2': [allTasks[2]],
          '/api/task_lists/4': [allTasks[7]],
        },
      };

      const result = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);

      expect(normalizeTasksListIdsToEdit(result)).toEqual(normalizeTasksListIdsToEdit({
        '/api/task_lists/1': [allTasks[0]],
        '/api/task_lists/2': [allTasks[2]],
        '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
        '/api/task_lists/4': [allTasks[6], allTasks[7]]
      }));
    });

    it('should return an object with several tasks by taskLists with related tasks and tasks for the same taskList including unassigned', () => {
      const selectedTasks = {
        orders: {
          '/api/task_lists/2': [allTasks[2]],
          '/api/task_lists/3': [allTasks[4]],
        },
        tasks: {
          'UNASSIGNED_TASKS_LIST': [allTasks[10]],
          '/api/task_lists/1': [allTasks[0]],
          '/api/task_lists/3': [allTasks[5]],
        },
      };

      const result = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);

      expect(normalizeTasksListIdsToEdit(result)).toEqual(normalizeTasksListIdsToEdit({
        'UNASSIGNED_TASKS_LIST': [allTasks[10]],
        '/api/task_lists/1': [allTasks[0]],
        '/api/task_lists/2': [allTasks[1], allTasks[2]],
        '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
        '/api/task_lists/4': [allTasks[6], allTasks[7]]
      }));
    });
  });

  describe('getTasksListIdsToEdit', () => {
    it('should return empty list for empty selected tasks', () => {
      const selectedTasks = {
        orders: {},
        tasks: {},
      };

      const result = getTasksListIdsToEdit(selectedTasks);

      expect(result).toEqual([]);
    });

    it('should return the union list for selected tasks with different task lists', () => {
      const selectedTasks = {
        orders: {
          '/api/task_lists/2': [allTasks[2]],
          '/api/task_lists/3': [allTasks[4]],
        },
        tasks: {
          '/api/task_lists/1': [allTasks[0]],
          '/api/task_lists/4': [allTasks[6]],
        },
      };

      const result = getTasksListIdsToEdit(selectedTasks);

      expect(result.sort()).toEqual([
        '/api/task_lists/1',
        '/api/task_lists/2',
        '/api/task_lists/3',
        '/api/task_lists/4',
      ].sort());
    });

    it('should return the union list for selected tasks with orders and tasks selected for the same task lists', () => {
      const selectedTasks = {
        orders: {
          '/api/task_lists/2': [allTasks[2]],
          '/api/task_lists/3': [allTasks[4]],
        },
        tasks: {
          '/api/task_lists/1': [allTasks[0]],
          '/api/task_lists/3': [allTasks[5]],
        },
      };

      const result = getTasksListIdsToEdit(selectedTasks);

      expect(result.sort()).toEqual([
        '/api/task_lists/1',
        '/api/task_lists/2',
        '/api/task_lists/3',
      ].sort());
    });
  })

  describe('buildSelectedTasks', () => {
    it('should return an empty object for orders and tasks if no order or task is provided', () => {
      const orders = [];
      const tasks = [];

      const result = buildSelectedTasks(orders, tasks, allTaskLists);

      expect(result).toEqual({
        orders: {},
        tasks: {}
      });
    });

    it('should return an object for orders if tasks are provided', () => {
      const orders = [allTasks[3], allTasks[4]];

      const result = buildSelectedTasks(orders, [], allTaskLists);

      expect(result).toEqual({
        orders: {
          '/api/task_lists/3': orders,
        },
        tasks: {},
      });
    });

    it('should return an object for tasks if tasks are provided', () => {
      const tasks = [allTasks[3], allTasks[4]];

      const result = buildSelectedTasks([], tasks, allTaskLists);

      expect(result).toEqual({
        orders: {},
        tasks: {
          '/api/task_lists/3': tasks,
        },
      });
    });

    it('should return an object for orders and tasks if both are provided', () => {
      const orders = [allTasks[3], allTasks[4]];
      const tasks = [allTasks[6], allTasks[7]];

      const result = buildSelectedTasks(orders, tasks, allTaskLists);

      expect(result).toEqual({
        orders: {
          '/api/task_lists/3': orders,
        },
        tasks: {
          '/api/task_lists/4': tasks,
        },
      });
    });
  });
});
