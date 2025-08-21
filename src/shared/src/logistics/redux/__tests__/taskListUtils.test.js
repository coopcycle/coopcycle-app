import _ from 'lodash';

import {
  buildSelectedTasks,
  createUnassignedTaskLists,
  getTaskListByTask,
  getTaskListTasks,
  getTasksListIdsToEdit,
  getTasksListsToEdit,
  replaceItemsWithItemIds,
  withLinkedTasksForTaskList,
} from '../taskListUtils.js';
import { getTaskListWithItems, getTaskWithPrevious } from '../testsUtils.js';
import { UNASSIGNED_TASKS_LIST_ID } from '../../../constants.js';

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
  getTaskWithPreviousWithUsernames(10, null, 9),
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

function sortTasksListItems(tasksListIdsToEdit) {
  return Object.keys(tasksListIdsToEdit).reduce((res, key) => {
    res[key] = _.sortBy([...tasksListIdsToEdit[key]], '@id');
    return res;
  }, {});
}

describe('taskListUtils', () => {
  describe('replaceItemsWithItemIds', () => {
    it('should remove items and add itemIds in a task list', () => {
      const taskList = allTaskLists[3];

      const result = replaceItemsWithItemIds(taskList);

      const expected = {
        ...taskList,
        itemIds: taskList.items,
      };
      delete expected.items;

      expect(result).toEqual(expected);
      expect(result).not.toBe(taskList);
    });
  });

  describe('getTaskListTasks', () => {
    it('should return empty if no tasks are loaded', () => {
      const taskList = allTaskLists[3];

      const tasksEntities = {};

      const result = getTaskListTasks(taskList, tasksEntities);

      expect(result).toEqual([]);
    });

    it('should return a partial list if some tasks are loaded', () => {
      const taskList = allTaskLists[3];

      const tasksEntities = {
        '/api/tasks/3': allTasks[3],
        '/api/tasks/4': allTasks[4],
      };

      const result = getTaskListTasks(taskList, tasksEntities);

      expect(result).toEqual([allTasks[3], allTasks[4]]);
    });

    it('should return all tasks if all tasks are loaded', () => {
      const taskList = allTaskLists[3];

      const tasksEntities = {
        '/api/tasks/2': allTasks[2],
        '/api/tasks/3': allTasks[3],
        '/api/tasks/4': allTasks[4],
        '/api/tasks/5': allTasks[5],
        '/api/tasks/6': allTasks[6],
      };

      const result = getTaskListTasks(taskList, tasksEntities);

      expect(result).toEqual([allTasks[3], allTasks[4], allTasks[5]]);
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
      // THIS
      const orders = {
        '/api/task_lists/3': [allTasks[4]],
      };

      const result = withLinkedTasksForTaskList(orders, allTasks, allTaskLists);

      expect(sortTasksListItems(result)).toEqual(
        sortTasksListItems({
          '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
          '/api/task_lists/4': [allTasks[6], allTasks[7]],
        }),
      );
    });

    it('should return an object with tasks for two taskLists with related tasks', () => {
      const orders = {
        '/api/task_lists/2': [allTasks[2]],
        '/api/task_lists/3': [allTasks[4]],
      };

      const result = withLinkedTasksForTaskList(orders, allTasks, allTaskLists);

      expect(sortTasksListItems(result)).toEqual(
        sortTasksListItems({
          '/api/task_lists/2': [allTasks[1], allTasks[2]],
          '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
          '/api/task_lists/4': [allTasks[6], allTasks[7]],
        }),
      );
    });

    it('should return an object with tasks for taskList including unassigned', () => {
      const orders = {
        '/api/task_lists/5': [allTasks[8]],
      };

      const result = withLinkedTasksForTaskList(orders, allTasks, allTaskLists);

      expect(sortTasksListItems(result)).toEqual({
        UNASSIGNED_TASKS_LIST: [allTasks[10]],
        '/api/task_lists/5': [allTasks[8]],
        '/api/task_lists/6': [allTasks[9]],
      });

      const orders2 = {
        '/api/task_lists/6': [allTasks[9]],
      };
      const result2 = withLinkedTasksForTaskList(
        orders2,
        allTasks,
        allTaskLists,
      );
      expect(sortTasksListItems(result2)).toEqual(sortTasksListItems(result));

      const orders3 = {
        UNASSIGNED_TASKS_LIST: [allTasks[10]],
      };
      const result3 = withLinkedTasksForTaskList(
        orders3,
        allTasks,
        allTaskLists,
      );
      expect(sortTasksListItems(result3)).toEqual(sortTasksListItems(result));
    });
  });

  describe('getTasksListsToEdit', () => {
    it('should return an empty object when nothing has been selected', () => {
      const selectedTasks = {
        orders: {},
        tasks: {},
      };

      const result = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);

      expect(sortTasksListItems(result)).toEqual({});
    });

    it('should return an object with tasks of just one taskLists', () => {
      const selectedTasks = {
        orders: {},
        tasks: {
          '/api/task_lists/2': [allTasks[1], allTasks[2]],
        },
      };

      const result = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);

      expect(sortTasksListItems(result)).toEqual(
        sortTasksListItems({
          '/api/task_lists/2': [allTasks[1], allTasks[2]],
        }),
      );
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

      expect(sortTasksListItems(result)).toEqual(
        sortTasksListItems({
          '/api/task_lists/1': [allTasks[0]],
          '/api/task_lists/2': [allTasks[1], allTasks[2]],
          '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
        }),
      );
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

      expect(sortTasksListItems(result)).toEqual(
        sortTasksListItems({
          '/api/task_lists/2': [allTasks[1], allTasks[2]],
          '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
          '/api/task_lists/4': [allTasks[6], allTasks[7]],
        }),
      );
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

      expect(sortTasksListItems(result)).toEqual(
        sortTasksListItems({
          '/api/task_lists/1': [allTasks[0]],
          '/api/task_lists/2': [allTasks[2]],
          '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
          '/api/task_lists/4': [allTasks[6], allTasks[7]],
        }),
      );
    });

    it('should return an object with several tasks by taskLists with related tasks and tasks for the same taskList including unassigned', () => {
      const selectedTasks = {
        orders: {
          '/api/task_lists/2': [allTasks[2]],
          '/api/task_lists/3': [allTasks[4]],
        },
        tasks: {
          UNASSIGNED_TASKS_LIST: [allTasks[10]],
          '/api/task_lists/1': [allTasks[0]],
          '/api/task_lists/3': [allTasks[5]],
        },
      };

      const result = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);

      expect(sortTasksListItems(result)).toEqual(
        sortTasksListItems({
          UNASSIGNED_TASKS_LIST: [allTasks[10]],
          '/api/task_lists/1': [allTasks[0]],
          '/api/task_lists/2': [allTasks[1], allTasks[2]],
          '/api/task_lists/3': [allTasks[3], allTasks[4], allTasks[5]],
          '/api/task_lists/4': [allTasks[6], allTasks[7]],
        }),
      );
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

      expect(result.sort()).toEqual(
        [
          '/api/task_lists/1',
          '/api/task_lists/2',
          '/api/task_lists/3',
          '/api/task_lists/4',
        ].sort(),
      );
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

      expect(result.sort()).toEqual(
        ['/api/task_lists/1', '/api/task_lists/2', '/api/task_lists/3'].sort(),
      );
    });
  });

  describe('getTaskListByTask', () => {
    it('should return undefined if Task does not belong to any TaskList', () => {
      const task = allTasks[10];

      const result = getTaskListByTask(task, allTaskLists);

      expect(result).toEqual(undefined);
    });

    it("should return task's tasklist if Task belongs to any TaskList", () => {
      const task = allTasks[0];

      const result = getTaskListByTask(task, allTaskLists);

      expect(result).toEqual(allTaskLists[1]);
    });
  });

  describe('buildSelectedTasks', () => {
    it('should return an empty object for orders and tasks if no order or task is provided', () => {
      const orders = [];
      const tasks = [];

      const result = buildSelectedTasks(orders, tasks, allTaskLists);

      expect(result).toEqual({
        orders: {},
        tasks: {},
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

  describe('createUnassignedTaskLists', () => {
    it('should split all the given unassigned tasks into a list of TaskList by related tasks', () => {
      const result = createUnassignedTaskLists(allTasks);

      expect(result).toEqual([
        {
          '@id': `${UNASSIGNED_TASKS_LIST_ID}-/api/tasks/2`,
          id: `${UNASSIGNED_TASKS_LIST_ID}-/api/tasks/2`,
          isUnassignedTaskList: true,
          items: [
            {
              '@id': '/api/tasks/1',
              assignedTo: 'username2',
              hasIncidents: false,
              id: 1,
              orgName: '',
              previous: null,
              status: '',
              tags: [],
            },
            {
              '@id': '/api/tasks/2',
              assignedTo: 'username2',
              hasIncidents: false,
              id: 2,
              orgName: '',
              previous: '/api/tasks/1',
              status: '',
              tags: [],
            },
          ],
          tasksIds: ['/api/tasks/1', '/api/tasks/2'],
          username: null,
          color: '#424242',
        },
        {
          '@id': `${UNASSIGNED_TASKS_LIST_ID}-/api/tasks/4`,
          id: `${UNASSIGNED_TASKS_LIST_ID}-/api/tasks/4`,
          isUnassignedTaskList: true,
          items: [
            {
              '@id': '/api/tasks/3',
              assignedTo: 'username3',
              hasIncidents: false,
              id: 3,
              orgName: '',
              previous: null,
              status: '',
              tags: [],
            },
            {
              '@id': '/api/tasks/4',
              assignedTo: 'username3',
              hasIncidents: false,
              id: 4,
              orgName: '',
              previous: '/api/tasks/3',
              status: '',
              tags: [],
            },
            {
              '@id': '/api/tasks/5',
              assignedTo: 'username3',
              hasIncidents: false,
              id: 5,
              orgName: '',
              previous: '/api/tasks/4',
              status: '',
              tags: [],
            },
            {
              '@id': '/api/tasks/6',
              assignedTo: 'username4',
              hasIncidents: false,
              id: 6,
              orgName: '',
              previous: '/api/tasks/5',
              status: '',
              tags: [],
            },
            {
              '@id': '/api/tasks/7',
              assignedTo: 'username4',
              hasIncidents: false,
              id: 7,
              orgName: '',
              previous: '/api/tasks/6',
              status: '',
              tags: [],
            },
          ],
          tasksIds: [
            '/api/tasks/3',
            '/api/tasks/4',
            '/api/tasks/5',
            '/api/tasks/6',
            '/api/tasks/7',
          ],
          username: null,
          color: '#424242',
        },
        {
          '@id': `${UNASSIGNED_TASKS_LIST_ID}-/api/tasks/9`,
          id: `${UNASSIGNED_TASKS_LIST_ID}-/api/tasks/9`,
          isUnassignedTaskList: true,
          items: [
            {
              '@id': '/api/tasks/10',
              assignedTo: '',
              hasIncidents: false,
              id: 10,
              orgName: '',
              previous: '/api/tasks/9',
              status: '',
              tags: [],
            },
            {
              '@id': '/api/tasks/8',
              assignedTo: 'username5',
              hasIncidents: false,
              id: 8,
              orgName: '',
              previous: null,
              status: '',
              tags: [],
            },
            {
              '@id': '/api/tasks/9',
              assignedTo: 'username6',
              hasIncidents: false,
              id: 9,
              orgName: '',
              previous: '/api/tasks/8',
              status: '',
              tags: [],
            },
          ],
          tasksIds: ['/api/tasks/10', '/api/tasks/8', '/api/tasks/9'],
          username: null,
          color: '#424242',
        },
      ]);
    });
  });
});
