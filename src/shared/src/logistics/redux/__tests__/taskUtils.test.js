import { getAssignedTask, groupLinkedTasks, tasksToIds } from '../taskUtils.js';

describe('taskUtils', () => {
  describe('groupLinkedTasks', () => {
    it('should group when tasks are ordered', () => {
      const tasks = [
        {
          '@id': '/api/tasks/1',
          id: 1,
          next: '/api/tasks/2',
        },
        {
          '@id': '/api/tasks/2',
          id: 2,
          previous: '/api/tasks/1',
        },
        {
          '@id': '/api/tasks/3',
          id: 3,
        },
      ];

      const groups = groupLinkedTasks(tasks);

      expect(groups).toEqual({
        '/api/tasks/1': ['/api/tasks/1', '/api/tasks/2'],
        '/api/tasks/2': ['/api/tasks/1', '/api/tasks/2'],
      });
    });

    it('should group when tasks are not ordered', () => {
      const tasks = [
        {
          '@id': '/api/tasks/2',
          id: 2,
          previous: '/api/tasks/1',
        },
        {
          '@id': '/api/tasks/1',
          id: 1,
          next: '/api/tasks/2',
        },
        {
          '@id': '/api/tasks/3',
          id: 3,
        },
      ];

      const groups = groupLinkedTasks(tasks);

      expect(groups).toEqual({
        '/api/tasks/1': ['/api/tasks/1', '/api/tasks/2'],
        '/api/tasks/2': ['/api/tasks/1', '/api/tasks/2'],
      });
    });

    it('should group when there are more than 2 tasks', () => {
      const tasks = [
        {
          '@id': '/api/tasks/1',
          id: 1,
          next: '/api/tasks/2',
        },
        {
          '@id': '/api/tasks/2',
          id: 2,
          previous: '/api/tasks/1',
          next: '/api/tasks/3',
        },
        {
          '@id': '/api/tasks/3',
          id: 3,
          previous: '/api/tasks/2',
        },
      ];

      const groups = groupLinkedTasks(tasks);

      expect(groups).toEqual({
        '/api/tasks/1': ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3'],
        '/api/tasks/2': ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3'],
        '/api/tasks/3': ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3'],
      });
    });

    it('should group when there are more than 2 tasks without next', () => {
      const tasks = [
        {
          '@id': '/api/tasks/1',
          id: 1,
        },
        {
          '@id': '/api/tasks/2',
          id: 2,
          previous: '/api/tasks/1',
        },
        {
          '@id': '/api/tasks/3',
          id: 3,
          previous: '/api/tasks/1',
        },
        {
          '@id': '/api/tasks/4',
          id: 4,
        },
      ];

      const groups = groupLinkedTasks(tasks);

      expect(groups).toEqual({
        '/api/tasks/1': ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3'],
        '/api/tasks/2': ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3'],
        '/api/tasks/3': ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3'],
      });
    });

    it('should group when there are more than 2 tasks without next, not ordered', () => {
      const tasks = [
        {
          '@id': '/api/tasks/2',
          id: 2,
          previous: '/api/tasks/1',
        },
        {
          '@id': '/api/tasks/3',
          id: 3,
          previous: '/api/tasks/1',
        },
        {
          '@id': '/api/tasks/4',
          id: 4,
        },
        {
          '@id': '/api/tasks/1',
          id: 1,
        },
      ];

      const groups = groupLinkedTasks(tasks);

      expect(groups).toEqual({
        '/api/tasks/1': ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3'],
        '/api/tasks/2': ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3'],
        '/api/tasks/3': ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3'],
      });
    });

    it('should group multiple', () => {
      const tasks = [
        {
          '@id': '/api/tasks/1',
          id: 1,
          next: '/api/tasks/2',
        },
        {
          '@id': '/api/tasks/2',
          id: 2,
          previous: '/api/tasks/1',
        },
        {
          '@id': '/api/tasks/3',
          id: 3,
        },
        {
          '@id': '/api/tasks/4',
          id: 4,
          next: '/api/tasks/5',
        },
        {
          '@id': '/api/tasks/5',
          id: 5,
          previous: '/api/tasks/4',
        },
      ];

      const groups = groupLinkedTasks(tasks);

      expect(groups).toEqual({
        '/api/tasks/1': ['/api/tasks/1', '/api/tasks/2'],
        '/api/tasks/2': ['/api/tasks/1', '/api/tasks/2'],
        '/api/tasks/4': ['/api/tasks/4', '/api/tasks/5'],
        '/api/tasks/5': ['/api/tasks/4', '/api/tasks/5'],
      });
    });
  });

  describe('tasksToIds', () => {
    it('should map tasks to task ids', () => {
      let tasks = [
        {
          '@id': '/api/tasks/1',
          id: 1,
        },
        {
          '@id': '/api/tasks/2',
          id: 2,
        },
      ];

      let ids = tasksToIds(tasks);

      expect(ids).toEqual(['/api/tasks/1', '/api/tasks/2']);
    });

    it('should map tasks to task ids with TaskCollectionItem', () => {
      let tasks = [
        {
          '@type': 'TaskCollectionItem',
          task: '/api/tasks/1',
        },
        {
          '@type': 'TaskCollectionItem',
          task: '/api/tasks/2',
        },
      ];

      let ids = tasksToIds(tasks);

      expect(ids).toEqual(['/api/tasks/1', '/api/tasks/2']);
    });
  });

  describe('getAssignedTask', () => {
    it('should assign user for a task unassigned', () => {
      const task = {
        '@id': '/api/tasks/1',
        id: 1,
        isAssigned: false,
        assignedTo: undefined,
      };

      const result = getAssignedTask(task, 'some username');

      expect(result).toEqual({
        ...task,
        isAssigned: true,
        assignedTo: 'some username',
      });
    });

    it('should assign user for a task assigned', () => {
      const task = {
        '@id': '/api/tasks/1',
        id: 1,
        isAssigned: true,
        assignedTo: 'some username',
      };

      const result = getAssignedTask(task, 'other username');

      expect(result).toEqual({
        ...task,
        isAssigned: true,
        assignedTo: 'other username',
      });
    });

    it('should unassign user for a task unassigned', () => {
      const task = {
        '@id': '/api/tasks/1',
        id: 1,
        isAssigned: false,
        assignedTo: undefined,
      };

      const result = getAssignedTask(task);

      expect(result).toEqual({
        ...task,
        isAssigned: false,
        assignedTo: undefined,
      });
    });

    it('should unassign user for a task assigned', () => {
      const task = {
        '@id': '/api/tasks/1',
        id: 1,
        isAssigned: true,
        assignedTo: 'some username',
      };

      const result = getAssignedTask(task);

      expect(result).toEqual({
        ...task,
        isAssigned: false,
        assignedTo: undefined,
      });
    });
  });
});
