import {
  replaceItemsWithItemIds,
  withLinkedTasksForTaskList,
} from '../taskListUtils.js';
import { tasksListsToEdit } from '../taskListUtils.js';

const getTask = (id, previous = null) => {
  return {
    '@id': `/api/tasks/${id}`,
    id: id,
    previous: previous ? `/api/tasks/${previous}` : null,
  };
};
const getTaskList = (id, items) => {
  return {
    '@id': `/api/task_lists/${id}`,
    id: id,
    items: items,
  };
};

describe('taskListUtils', () => {
  describe('replaceItemsWithItemIds', () => {
    it('should remove items and add itemIds in a task list', () => {
      let taskList = {
        '@id': '/api/task_lists/1',
        username: 'bot_1',
        items: ['/api/tasks/1', '/api/tasks/2'],
      };

      let result = replaceItemsWithItemIds(taskList);

      expect(result).toEqual({
        '@id': '/api/task_lists/1',
        username: 'bot_1',
        itemIds: ['/api/tasks/1', '/api/tasks/2'],
      });
      expect(result).not.toBe(taskList);
    });
  });
  describe('withLinkedTasksForTaskList', () => {
    const allTaskLists = [
      getTaskList(1, []),
      getTaskList(2, [getTask(1)]),
      getTaskList(3, [getTask(2), getTask(3, 2)]),
      getTaskList(4, [getTask(4), getTask(5, 4), getTask(6, 5)]),
      getTaskList(5, [getTask(7, 1), getTask(8, 7)]),
    ];
    it('should retun an empty object if no orders selected', () => {
      const orders = {};
      let result = withLinkedTasksForTaskList(orders, allTaskLists);

      expect(result).toEqual({});
    });
    it('should retun an object with tasks for taskLists with no related tasks', () => {
      const orders = {
        '/api/task_lists/2': [getTask(1)],
      };
      let result = withLinkedTasksForTaskList(orders, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/2': [getTask(1)],
      });
    });
    it('should retun an object with tasks for one taskLists with related tasks', () => {
      const orders = {
        '/api/task_lists/4': [getTask(5)],
      };
      let result = withLinkedTasksForTaskList(orders, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/4': [getTask(4), getTask(5, 4), getTask(6, 5)],
      });
    });
    it('should retun an object with tasks for two taskLists with related tasks', () => {
      const orders = {
        '/api/task_lists/3': [getTask(3)],
        '/api/task_lists/4': [getTask(5)],
      };
      let result = withLinkedTasksForTaskList(orders, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/3': [getTask(2), getTask(3, 2)],
        '/api/task_lists/4': [getTask(4), getTask(5, 4), getTask(6, 5)],
      });
    });
    it('should retun an object with tasks for taskLists with related tasks in other taskList', () => {
      const orders = {
        '/api/task_lists/5': [getTask(7)],
      };
      let result = withLinkedTasksForTaskList(orders, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/5': [getTask(7, 1), getTask(8, 7)],
      });
    });
  });
  describe('tasksListsToEdit', () => {
    const allTaskLists = [
      getTaskList(1, []),
      getTaskList(2, [getTask(1)]),
      getTaskList(3, [getTask(2), getTask(3, 2)]),
      getTaskList(4, [getTask(4), getTask(5, 4), getTask(6, 5)]),
      getTaskList(5, [getTask(7, 1), getTask(8, 7)]),
    ];
    it('should retun an empty object when nothing has been selected', () => {
      const selectedTasks = {
        orders: {},
        tasks: {},
      };

      const result = tasksListsToEdit(selectedTasks, allTaskLists);

      expect(result).toEqual({});
    });
    it('should retun an object with tasks of just one taskLists', () => {
      const selectedTasks = {
        orders: {},
        tasks: {
          '/api/task_lists/1': [getTask(1), getTask(2)],
        },
      };

      let result = tasksListsToEdit(selectedTasks, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/1': [getTask(1), getTask(2)],
      });
    });
    it('should retun an object with tasks order by taskLists', () => {
      const selectedTasks = {
        orders: {},
        tasks: {
          '/api/task_lists/1': [getTask(1), getTask(2)],
          '/api/task_lists/2': [getTask(3), getTask(4)],
          '/api/task_lists/3': [getTask(5), getTask(6), getTask(7)],
        },
      };

      let result = tasksListsToEdit(selectedTasks);

      expect(result).toEqual({
        '/api/task_lists/1': [getTask(1), getTask(2)],
        '/api/task_lists/2': [getTask(3), getTask(4)],
        '/api/task_lists/3': [getTask(5), getTask(6), getTask(7)],
      });
    });
    it('should retun an object with several orders tasks by taskLists with related tasks', () => {
      const selectedTasks = {
        orders: {
          '/api/task_lists/3': [getTask(3)],
          '/api/task_lists/4': [getTask(5)],
        },
        tasks: {},
      };
      let result = tasksListsToEdit(selectedTasks, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/3': [getTask(2), getTask(3, 2)],
        '/api/task_lists/4': [getTask(4), getTask(5, 4), getTask(6, 5)],
      });
    });
    it('should retun an object with several orders tasks by taskLists with related tasks and tasks', () => {
      const selectedTasks = {
        orders: {
          '/api/task_lists/3': [getTask(3)],
          '/api/task_lists/4': [getTask(5)],
        },
        tasks: {
          '/api/task_lists/2': [getTask(1)],
          '/api/task_lists/5': [getTask(8)],
        },
      };
      let result = tasksListsToEdit(selectedTasks, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/2': [getTask(1)],
        '/api/task_lists/3': [getTask(2), getTask(3, 2)],
        '/api/task_lists/4': [getTask(4), getTask(5, 4), getTask(6, 5)],
        '/api/task_lists/5': [getTask(8)],
      });
    });
    it('should retun an object with several tasks by taskLists with related tasks and tasks for the same taskList', () => {
      const selectedTasks = {
        orders: {
          '/api/task_lists/3': [getTask(3)],
          '/api/task_lists/4': [getTask(5)],
        },
        tasks: {
          '/api/task_lists/2': [getTask(1)],
          '/api/task_lists/4': [getTask(6)],
        },
      };
      let result = tasksListsToEdit(selectedTasks, allTaskLists);

      expect(result).toEqual({
        '/api/task_lists/2': [getTask(1)],
        '/api/task_lists/3': [getTask(2), getTask(3, 2)],
        '/api/task_lists/4': [getTask(4), getTask(5, 4), getTask(6, 5)],
      });
    });
  });
});
