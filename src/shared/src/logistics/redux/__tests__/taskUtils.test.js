import {
  displayPricePerOrder,
  filterTasksByKeyword,
  getAssignedTask,
  getTasksWithColor,
  getToursToUpdate,
  groupLinkedTasks,
  mapToColor,
  taskIncludesKeyword,
  tasksToIds,
} from '../taskUtils.ts';
import {
  getTaskWithAssignedTo,
  getTaskWithStoreName,
  getTaskWithTags,
} from '../testsUtils.js';

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

  describe('getTasksWithColor', () => {
    it('should map every task with its corresponding color', () => {
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

      const coloredTasks = getTasksWithColor(tasks);

      expect(coloredTasks).toEqual([
        {
          '@id': '/api/tasks/1',
          id: 1,
          next: '/api/tasks/2',
          color: '#6c87e0',
        },
        {
          '@id': '/api/tasks/2',
          id: 2,
          previous: '/api/tasks/1',
          color: '#6c87e0',
        },
        {
          '@id': '/api/tasks/3',
          id: 3,
          color: '#ffffff',
        },
      ]);
    });
  });

  describe('mapToColor', () => {
    it('should contain key', () => {
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
      const taskColors = mapToColor(tasks);

      const taskIds = tasks.map(task => task['@id']);
      Object.keys(taskColors).forEach(key => {
        expect(taskIds).toContain(key);
      });
    });
  });

  describe('tasksToIds', () => {
    it('should map tasks to task ids', () => {
      const tasks = [
        {
          '@id': '/api/tasks/1',
          id: 1,
        },
        {
          '@id': '/api/tasks/2',
          id: 2,
        },
      ];

      const ids = tasksToIds(tasks);

      expect(ids).toEqual(['/api/tasks/1', '/api/tasks/2']);
    });

    it('should map tasks to task ids with TaskCollectionItem', () => {
      const tasks = [
        {
          '@type': 'TaskCollectionItem',
          task: '/api/tasks/1',
        },
        {
          '@type': 'TaskCollectionItem',
          task: '/api/tasks/2',
        },
      ];

      const ids = tasksToIds(tasks);

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
      const itemIds = ['/api/tasks/1', '/api/tasks/2'];
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
      const itemIds = ['/api/tasks/1', '/api/tasks/2'];
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
          '/api/tours/2': ['/api/tasks/5', '/api/tasks/6'],
        },
      };

      const result = getToursToUpdate(itemIds, toursIndexes);

      expect(result).toEqual({
        '/api/tours/1': ['/api/tasks/3', '/api/tasks/4'],
      });
    });

    it('should return empty if no tour has the items ids', () => {
      const itemIds = ['/api/tasks/7', '/api/tasks/8'];
      const toursIndexes = {
        tasks: {
          '/api/tasks/1': '/api/tours/1',
          '/api/tasks/2': '/api/tours/1',
          '/api/tasks/5': '/api/tours/2',
          '/api/tasks/6': '/api/tours/2',
        },
        tours: {
          '/api/tours/1': ['/api/tasks/1', '/api/tasks/2'],
          '/api/tours/2': ['/api/tasks/3', '/api/tasks/4'],
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

    it.each(['bob', 'Bob', 'BOB'])(
      'should return tasks that have searchString in assignedTo',
      searchString => {
        const result = filterTasksByKeyword(tasks, searchString);

        expect(result).toEqual(tasks.slice(1, 2));
      },
    );

    it.each(['bullanga', 'Bullanga', 'BULLANGA'])(
      'should return tasks that have searchString in store name',
      searchString => {
        const result = filterTasksByKeyword(tasks, searchString);

        expect(result).toEqual(tasks.slice(4, 5));
      },
    );

    it.each(['bbb', 'BBB'])(
      'should return tasks that have searchString in any tag',
      searchString => {
        const result = filterTasksByKeyword(tasks, searchString);

        expect(result).toEqual(tasks.slice(7, 8));
      },
    );
  });

  describe('taskIncludesKeyword', () => {
    it('should return true if keyword is empty', () => {
      const task = getTaskWithAssignedTo('Assigned to Alba');
      const keyword = '';

      const result = taskIncludesKeyword(task, keyword);

      expect(result).toBe(true);
    });

    it.each([
      ['Alba', true],
      ['not', false],
    ])(
      'should return if keyword is included in assignedTo',
      (keyword, expected) => {
        const task = getTaskWithAssignedTo('Assigned to Alba');

        const result = taskIncludesKeyword(task, keyword);

        expect(result).toBe(expected);
      },
    );

    it.each([
      ['Acme', true],
      ['not', false],
    ])(
      'should return if keyword is included in store name',
      (keyword, expected) => {
        const task = getTaskWithStoreName('Store name ACME');

        const result = taskIncludesKeyword(task, keyword);

        expect(result).toBe(expected);
      },
    );

    it.each([
      ['aa', true],
      ['not', false],
    ])('should return if keyword is included in tags', (keyword, expected) => {
      const task = getTaskWithTags(['A', 'AA', 'AAA']);

      const result = taskIncludesKeyword(task, keyword);

      expect(result).toBe(expected);
    });
  });

  describe('displayPricePerOrder', () => {
    it('should return tasks unchanged when no tasks have order_number', () => {
      const tasks = [
        { id: 1, type: 'PICKUP', metadata: {} },
        { id: 2, type: 'DROPOFF', metadata: {} },
      ];

      const result = displayPricePerOrder(tasks);

      expect(result).toEqual(tasks);
    });

    it('should return tasks unchanged when tasks have order_number but no multiple tasks of same type', () => {
      const tasks = [
        { id: 1, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: null } },
        { id: 2, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },
      ];

      const result = displayPricePerOrder(tasks);

      expect(result).toEqual(tasks);
    });

    it('should set order_total to null for all but first DROPOFF when multiple PICKUPs in same order', () => {
      const tasks = [
        { id: 1, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: 100 } },
        { id: 2, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: 100 } },
        { id: 3, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },
      ];

      const result = displayPricePerOrder(tasks);

      expect(result).toEqual([
        { id: 1, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: null } },
        { id: 2, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: null } },
        { id: 3, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },
      ]);
    });

    it('should set order_total to null for all but first PICKUP when multiple DROPOFFs in same order', () => {
      const tasks = [
        { id: 1, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: 100 } },
        { id: 2, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },
        { id: 3, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },
      ];

      const result = displayPricePerOrder(tasks);

      expect(result).toEqual([
        { id: 1, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: 100 } },
        { id: 2, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: null } },
        { id: 3, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: null } },
      ]);
    });

    it('should handle multiple orders independently', () => {
      const tasks = [
        // Order 1 - multiple PICKUPs
        { id: 1, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: 100 } },
        { id: 2, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: 100 } },
        { id: 3, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },

        // Order 2 - multiple DROPOFFs
        { id: 4, type: 'PICKUP', metadata: { order_number: 'ORD-002', order_total: 200 } },
        { id: 5, type: 'DROPOFF', metadata: { order_number: 'ORD-002', order_total: 200 } },
        { id: 6, type: 'DROPOFF', metadata: { order_number: 'ORD-002', order_total: 200 } },

        // Order 3 - no multiple tasks
        { id: 7, type: 'PICKUP', metadata: { order_number: 'ORD-003', order_total: 300 } },
        { id: 8, type: 'DROPOFF', metadata: { order_number: 'ORD-003', order_total: 300 } },
      ];

      const result = displayPricePerOrder(tasks);

      expect(result).toEqual([
        // Order 1 - first DROPOFF keeps order_total
        { id: 1, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: null } },
        { id: 2, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: null } },
        { id: 3, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },

        // Order 2 - first PICKUP keeps order_total
        { id: 4, type: 'PICKUP', metadata: { order_number: 'ORD-002', order_total: 200 } },
        { id: 5, type: 'DROPOFF', metadata: { order_number: 'ORD-002', order_total: null } },
        { id: 6, type: 'DROPOFF', metadata: { order_number: 'ORD-002', order_total: null } },

        // Order 3 - unchanged
        { id: 7, type: 'PICKUP', metadata: { order_number: 'ORD-003', order_total: null } },
        { id: 8, type: 'DROPOFF', metadata: { order_number: 'ORD-003', order_total: 300 } },
      ]);
    });

    it('should handle multiple orders independently when isFromCourier is true', () => {
      const tasks = [
        // Order 1 - multiple PICKUPs
        { id: 1, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: 100 } },
        { id: 2, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: 100 } },
        { id: 3, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },

        // Order 2 - multiple DROPOFFs
        { id: 4, type: 'PICKUP', metadata: { order_number: 'ORD-002', order_total: 200 } },
        { id: 5, type: 'DROPOFF', metadata: { order_number: 'ORD-002', order_total: 200 } },
        { id: 6, type: 'DROPOFF', metadata: { order_number: 'ORD-002', order_total: 200 } },
      ];

      const result = displayPricePerOrder(tasks, true);

      expect(result).toEqual([
        // Order 1 - pickups null, dropoff keeps
        { id: 1, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: null } },
        { id: 2, type: 'PICKUP', metadata: { order_number: 'ORD-001', order_total: null } },
        { id: 3, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },

        // Order 2 - pickup null, all dropoffs keep
        { id: 4, type: 'PICKUP', metadata: { order_number: 'ORD-002', order_total: null } },
        { id: 5, type: 'DROPOFF', metadata: { order_number: 'ORD-002', order_total: 200 } },
        { id: 6, type: 'DROPOFF', metadata: { order_number: 'ORD-002', order_total: 200 } },
      ]);
    });

    it('should handle tasks without metadata', () => {
      const tasks = [
        { id: 1, type: 'PICKUP' },
        { id: 2, type: 'DROPOFF', metadata: { order_number: 'ORD-001', order_total: 100 } },
      ];

      const result = displayPricePerOrder(tasks);

      expect(result).toEqual(tasks);
    });
  });
});


