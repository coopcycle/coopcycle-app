import {
  findTaskListByTask,
  findTaskListByUsername,
} from '../taskListEntityUtils.js';

describe('taskListEntityUtils', () => {
  describe('findTaskListByUsername', () => {
    it('should return a task list, if it is found ', () => {
      let taskListsById = {
        '/api/task_lists/1': {
          '@id': '/api/task_lists/1',
          username: 'bot_1',
          itemIds: ['/api/tasks/1', '/api/tasks/2'],
        },
        '/api/task_lists/2': {
          '@id': '/api/task_lists/2',
          username: 'bot_2',
          itemIds: ['/api/tasks/3', '/api/tasks/4'],
        },
      };

      let result = findTaskListByUsername(taskListsById, 'bot_2');

      expect(result).toEqual({
        '@id': '/api/task_lists/2',
        username: 'bot_2',
        itemIds: ['/api/tasks/3', '/api/tasks/4'],
      });
    });

    it('should return undefined if a user does not have a task list', () => {
      let taskListsById = {
        '/api/task_lists/1': {
          '@id': '/api/task_lists/1',
          username: 'bot_1',
          itemIds: ['/api/tasks/1', '/api/tasks/2'],
        },
      };

      let result = findTaskListByUsername(taskListsById, 'bot_3');

      expect(result).toBeUndefined();
    });
  });

  describe('findTaskListByTask', () => {
    it('should return a task list, if it is found ', () => {
      let taskListsById = {
        '/api/task_lists/1': {
          '@id': '/api/task_lists/1',
          username: 'bot_1',
          itemIds: ['/api/tasks/1', '/api/tasks/2'],
        },
        '/api/task_lists/2': {
          '@id': '/api/task_lists/2',
          username: 'bot_2',
          itemIds: ['/api/tasks/3', '/api/tasks/4'],
        },
      };

      let task = {
        '@id': '/api/tasks/1',
        id: 1,
        next: '/api/tasks/2',
      };

      let result = findTaskListByTask(taskListsById, task);

      expect(result).toEqual({
        '@id': '/api/task_lists/1',
        username: 'bot_1',
        itemIds: ['/api/tasks/1', '/api/tasks/2'],
      });
    });

    it('should return undefined if task does not belong to any tasklist', () => {
      let taskListsById = {
        '/api/task_lists/1': {
          '@id': '/api/task_lists/1',
          username: 'bot_1',
          itemIds: ['/api/tasks/1', '/api/tasks/2'],
        },
        '/api/task_lists/2': {
          '@id': '/api/task_lists/2',
          username: 'bot_2',
          itemIds: ['/api/tasks/3', '/api/tasks/4'],
        },
      };

      let task = {
        '@id': '/api/tasks/5',
        id: 1,
        next: '/api/tasks/2',
      };

      let result = findTaskListByTask(taskListsById, task);

      expect(result).toBeUndefined();
    });
  });
});
