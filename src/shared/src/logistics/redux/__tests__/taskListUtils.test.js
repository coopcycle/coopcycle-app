import _ from 'lodash';

import {
  getTasksListIdsToEdit,
  getTasksListsToEdit,
  replaceItemsWithItemIds,
  withLinkedTasksForTaskList,
} from '../taskListUtils.js';


const getTask = (id, previous = null) => {
  return {
    '@id': `/api/tasks/${id}`,
    id: id,
    previous: previous ? `/api/tasks/${previous}` : null,
  };
};

const getTaskList = (id, items) => {
  const username = usernames[id];
  return {
    '@id': `/api/task_lists/${id}`,
    id: id,
    items: items.map(task => ({...task, assignedTo: username})) || [],
    username,
  };
};

const allTasks = [
  getTask(0),
  getTask(1),
  getTask(2, 1),
  getTask(3),
  getTask(4, 3),
  getTask(5, 4),
  getTask(6, 5),
  getTask(7, 6),
  getTask(8),
  getTask(9, 8),
  getTask(10, 9)
];

const usernames = [
  'username0',
  'username1',
  'username2',
  'username3',
  'username4',
  'username5',
  'username6',
];

const allTaskLists = [
  getTaskList(0, []),
  getTaskList(1, [allTasks[0]]),
  getTaskList(2, [allTasks[1], allTasks[2]]),
  getTaskList(3, [allTasks[3], allTasks[4], allTasks[5]]),
  getTaskList(4, [allTasks[6], allTasks[7]]),
  getTaskList(5, [allTasks[8]]),
  getTaskList(6, [allTasks[9]]),
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
        '/api/task_lists/4',
      ].sort());
    });
  })
});
