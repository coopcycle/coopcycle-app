import {
  filterTasksByKeyword,
  getAssignedTask,
  getToursToUpdate,
  groupLinkedTasks,
  tasksToIds,
} from '../taskUtils.js';
import { getTaskWithAssignedTo, getTaskWithStoreName, getTaskWithTags } from '../testsUtils.js';

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

  describe('getToursToUpdate', () => {
    it('should return empty if there is no tours', () => {
      const itemIds = [
        '/api/tasks/1',
        '/api/tasks/2',
      ];
      const toursIndexes = {
        tasks: {},
        tours: {},
      };

      const result = getToursToUpdate(itemIds, toursIndexes);

      expect(result).toEqual({});
    });

    it('should return empty if there is no tasks', () => {
      const itemIds = [];
      const toursIndexes = {
        tasks: {},
        tours: {
          '/api/tours/1': [],
        },
      };

      const result = getToursToUpdate(itemIds, toursIndexes);

      expect(result).toEqual({});
    });

    it('should return only the tour that have the items ids and remove them', () => {
      const itemIds = [
        '/api/tasks/1',
        '/api/tasks/2',
      ];
      const toursIndexes = {
        tasks: {
          '/api/tasks/1': '/api/tours/1',
          '/api/tasks/2': '/api/tours/1',
          '/api/tasks/3': '/api/tours/1',
          '/api/tasks/4': '/api/tours/1',
          '/api/tasks/5': '/api/tours/2',
          '/api/tasks/6': '/api/tours/2',
        },
        tours: {
          '/api/tours/1': [
            '/api/tasks/1',
            '/api/tasks/2',
            '/api/tasks/3',
            '/api/tasks/4',
          ],
          '/api/tours/2': [
            '/api/tasks/5',
            '/api/tasks/6',
          ],
        },
      };

      const result = getToursToUpdate(itemIds, toursIndexes);

      expect(result).toEqual({
        '/api/tours/1': [
          '/api/tasks/3',
          '/api/tasks/4',
        ],
      });
    });

    it('should return empty if no tour has the items ids', () => {
      const itemIds = [
        '/api/tasks/7',
        '/api/tasks/8',
      ];
      const toursIndexes = {
        tasks: {
          '/api/tasks/1': '/api/tours/1',
          '/api/tasks/2': '/api/tours/1',
          '/api/tasks/5': '/api/tours/2',
          '/api/tasks/6': '/api/tours/2',
        },
        tours: {
          '/api/tours/1': [
            '/api/tasks/1',
            '/api/tasks/2',
          ],
          '/api/tours/2': [
            '/api/tasks/3',
            '/api/tasks/4',
          ],
        },
      };

      const result = getToursToUpdate(itemIds, toursIndexes);

      expect(result).toEqual({});
    });
  });

  describe('filterTasksByKeyword', () => {
    const tasks = [
      getTaskWithAssignedTo('Assigned to Alba'),
      getTaskWithAssignedTo('Assigned to Bob'),
      getTaskWithAssignedTo('Assigned to Carla'),
      getTaskWithStoreName('Store name ACME'),
      getTaskWithStoreName('Store name Bullanga'),
      getTaskWithStoreName('Store name Cremon'),
      getTaskWithTags(['A', 'AA', 'AAA']),
      getTaskWithTags(['B', 'BB', 'BBB']),
      getTaskWithTags(['C', 'CC', 'CCC']),
    ];

    it('should return all tasks if search string is empty', () => {
      const searchString = '';

      const result = filterTasksByKeyword(tasks, searchString);

      expect(result).toEqual(tasks);
    });

    it.each([
      'bob', 'Bob', 'BOB'
    ])('should return tasks that have searchString in assignedTo', (searchString) => {
      const result = filterTasksByKeyword(tasks, searchString);

      expect(result).toEqual(tasks.slice(1,2));
    });

    it.each([
      'bullanga', 'Bullanga', 'BULLANGA'
    ])('should return tasks that have searchString in store name', (searchString) => {
      const result = filterTasksByKeyword(tasks, searchString);

      expect(result).toEqual(tasks.slice(4,5));
    });

    it.each([
      'bbb', 'BBB',
    ])('should return tasks that have searchString in any tag', (searchString) => {
      const result = filterTasksByKeyword(tasks, searchString);

      expect(result).toEqual(tasks.slice(7,8));
    });
  });
});
