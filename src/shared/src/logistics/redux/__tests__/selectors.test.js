import {
  selectAllTasks,
  selectAssignedTasks,
  selectSelectedDate,
  selectTaskLists,
  selectTasksWithColor,
  selectUnassignedTasks,
} from '../selectors';

import moment from '../../../moment';

describe('Selectors', () => {
  let date = moment().format('YYYY-MM-DD');

  let baseState = {
    logistics: {
      date,
      entities: {
        tasks: {
          ids: ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3', '/api/tasks/4', '/api/tasks/5', '/api/tasks/6', '/api/tasks/7', '/api/tasks/8'],
          entities: {
            // TaskList 1
            '/api/tasks/1': {
              '@id': '/api/tasks/1',
              id: 1,
              next: '/api/tasks/2',
              isAssigned: true,
            },
            // TaskList 1
            '/api/tasks/2': {
              '@id': '/api/tasks/2',
              id: 2,
              previous: '/api/tasks/1',
              isAssigned: true,
            },
            // TaskList 2
            '/api/tasks/3': {
              '@id': '/api/tasks/3',
              id: 3,
              isAssigned: true,
            },
            // TaskList 3
            '/api/tasks/4': {
              '@id': '/api/tasks/4',
              id: 4,
              isAssigned: true,
            },
            // TaskList 3 - Tour 1
            '/api/tasks/5': {
              '@id': '/api/tasks/5',
              id: 5,
              isAssigned: true,
            },
            // TaskList 3 - Tour 1
            '/api/tasks/6': {
              '@id': '/api/tasks/6',
              id: 6,
              isAssigned: true,
            },
            // Tour 2
            '/api/tasks/7': {
              '@id': '/api/tasks/7',
              id: 7,
            },
            '/api/tasks/8': {
              '@id': '/api/tasks/8',
              id: 8,
            },
          },
        },
        taskLists: {
          ids: ['/api/task_lists/1', '/api/task_lists/2', '/api/task_lists/3'],
          entities: {
            '/api/task_lists/1': {
              '@id': '/api/task_lists/1',
              username: 'bot_1',
              itemIds: ['/api/tasks/1', '/api/tasks/2'],
            },
            '/api/task_lists/2': {
              '@id': '/api/task_lists/2',
              username: 'bot_2',
              itemIds: ['/api/tasks/3'],
            },
            '/api/task_lists/3': {
              '@id': '/api/task_lists/3',
              username: 'bot_3',
              itemIds: ['/api/tasks/4', '/api/tours/1'],
            },
          },
        },
        tours: {
          ids: ['/api/tours/1', '/api/tours/2', ],
          entities: {
            // TaskList 3
            '/api/tours/1': {
              '@id': '/api/tours/1',
              items: ['/api/tasks/5', '/api/tasks/6'],
            },
            '/api/tours/2': {
              '@id': '/api/tours/2',
              items: ['/api/tasks/7'],
            },
          }
        },
      },
      ui: {
        taskListsLoading: false,
      },
    },
  };

  describe('selectSelectedDate', () => {
    it('should return selected date', () => {
      expect(selectSelectedDate(baseState)).toEqual(date);
    });
  });

  describe('selectTaskLists', () => {
    it('should return task lists with tasks', () => {
      expect(selectTaskLists(baseState)).toEqual([
        {
          '@id': '/api/task_lists/1',
          username: 'bot_1',
          items: [
            {
              '@id': '/api/tasks/1',
              id: 1,
              next: '/api/tasks/2',
              isAssigned: true,
            },
            {
              '@id': '/api/tasks/2',
              id: 2,
              previous: '/api/tasks/1',
              isAssigned: true,
            },
          ],
        },
        {
          '@id': '/api/task_lists/2',
          username: 'bot_2',
          items: [
            {
              '@id': '/api/tasks/3',
              id: 3,
              isAssigned: true,
            },
          ],
        },
        {
          '@id': '/api/task_lists/3',
          username: 'bot_3',
          items: [
            {
              '@id': '/api/tasks/4',
              id: 4,
              isAssigned: true,
            },
            {
              '@id': '/api/tasks/5',
              id: 5,
              isAssigned: true,
            },
            {
              '@id': '/api/tasks/6',
              id: 6,
              isAssigned: true,
            },
          ],
        },
      ]);
    });

    it('should return task lists without some tasks if they are not loaded', () => {
      let _baseState = {
        logistics: {
          date,
          entities: {
            tasks: {
              ids: ['/api/tasks/1'],
              entities: {
                '/api/tasks/1': {
                  '@id': '/api/tasks/1',
                  id: 1,
                  isAssigned: true,
                },
              },
            },
            taskLists: {
              ids: ['/api/task_lists/1'],
              entities: {
                '/api/task_lists/1': {
                  '@id': '/api/task_lists/1',
                  username: 'bot_1',
                  itemIds: ['/api/tasks/1', '/api/tasks/2'],
                },
              },
            },
            tours: {
              ids: [],
              entities: {}
            },
          },
          ui: {
            taskListsLoading: false,
          },
        },
      };

      expect(selectTaskLists(_baseState)).toEqual([
        {
          '@id': '/api/task_lists/1',
          username: 'bot_1',
          items: [
            {
              '@id': '/api/tasks/1',
              id: 1,
              isAssigned: true,
            },
          ],
        },
      ]);
    });
  });

  describe('selectAllTasks', () => {
    it('should return all tasks', () => {
      expect(selectAllTasks(baseState)).toEqual([
        {
          '@id': '/api/tasks/1',
          id: 1,
          next: '/api/tasks/2',
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/2',
          id: 2,
          previous: '/api/tasks/1',
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/3',
          id: 3,
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/4',
          id: 4,
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/5',
          id: 5,
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/6',
          id: 6,
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/7',
          id: 7,
        },
        {
          '@id': '/api/tasks/8',
          id: 8,
        },
      ]);
    });
  });

  describe('selectAssignedTasks', () => {
    it('should return assigned tasks', () => {
      expect(selectAssignedTasks(baseState)).toEqual([
        {
          '@id': '/api/tasks/1',
          id: 1,
          next: '/api/tasks/2',
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/2',
          id: 2,
          previous: '/api/tasks/1',
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/3',
          id: 3,
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/4',
          id: 4,
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/5',
          id: 5,
          isAssigned: true,
        },
        {
          '@id': '/api/tasks/6',
          id: 6,
          isAssigned: true,
        },
      ]);
    });
  });

  describe('selectUnassignedTasks', () => {
    it('should return unassigned tasks', () => {
      expect(selectUnassignedTasks(baseState)).toEqual([
        {
          '@id': '/api/tasks/7',
          id: 7,
        },
        {
          '@id': '/api/tasks/8',
          id: 8,
        },
      ]);
    });
  });

  describe('selectTasksWithColor', () => {
    it('should return tasks with a color tag', () => {
      expect(selectTasksWithColor(baseState)).toEqual({
        '/api/tasks/1': '#6c87e0',
        '/api/tasks/2': '#6c87e0',
      });
    });
  });
});
