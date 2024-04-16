import { default as taskEntityReducers } from '../taskEntityReducers';

describe('taskEntityReducers', () => {
  describe('CHANGE_DATE', () => {
    it('should remove old items when the date is selected', () => {
      expect(
        taskEntityReducers(
          {
            ids: ['/api/tasks/1'],
            entities: {
              '/api/tasks/1': {
                '@id': '/api/tasks/1',
                id: 1,
                isAssigned: false,
              },
            },
          },
          {
            type: 'CHANGE_DATE',
            payload: '2020-11-03T23:00:00.000Z',
          },
        ),
      ).toEqual({
        ids: [],
        entities: {},
      });
    });
  });

  describe('LOAD_UNASSIGNED_TASKS_SUCCESS', () => {
    it('should add items', () => {
      expect(
        taskEntityReducers(
          {
            ids: [],
            entities: {},
          },
          {
            type: 'LOAD_UNASSIGNED_TASKS_SUCCESS',
            payload: [
              {
                '@id': '/api/tasks/1',
                id: 1,
                isAssigned: false,
              },
              {
                '@id': '/api/tasks/2',
                id: 2,
                isAssigned: false,
              },
            ],
          },
        ),
      ).toEqual({
        ids: ['/api/tasks/1', '/api/tasks/2'],
        entities: {
          '/api/tasks/1': {
            '@id': '/api/tasks/1',
            id: 1,
            isAssigned: false,
          },
          '/api/tasks/2': {
            '@id': '/api/tasks/2',
            id: 2,
            isAssigned: false,
          },
        },
      });
    });

    it('should update items', () => {
      expect(
        taskEntityReducers(
          {
            ids: ['/api/tasks/1'],
            entities: {
              '/api/tasks/1': {
                '@id': '/api/tasks/1',
                id: 1,
                isAssigned: false,
              },
            },
          },
          {
            type: 'LOAD_UNASSIGNED_TASKS_SUCCESS',
            payload: [
              {
                '@id': '/api/tasks/1',
                id: 1,
                isAssigned: false,
                comments: 'new comment',
              },
              {
                '@id': '/api/tasks/2',
                id: 2,
                isAssigned: false,
                comments: 'new comment',
              },
            ],
          },
        ),
      ).toEqual({
        ids: ['/api/tasks/1', '/api/tasks/2'],
        entities: {
          '/api/tasks/1': {
            '@id': '/api/tasks/1',
            id: 1,
            isAssigned: false,
            comments: 'new comment',
          },
          '/api/tasks/2': {
            '@id': '/api/tasks/2',
            id: 2,
            isAssigned: false,
            comments: 'new comment',
          },
        },
      });
    });
  });

  describe('LOAD_TASK_LISTS_SUCCESS', () => {
    it('should add items', () => {
      expect(
        taskEntityReducers(
          {
            ids: [],
            entities: {},
          },
          {
            type: 'LOAD_TASK_LISTS_SUCCESS',
            payload: [
              {
                '@id': '/api/task_lists/1',
                '@type': 'TaskList',
                items: [
                  {
                    '@id': '/api/tasks/1',
                    id: 1,
                    isAssigned: true,
                    assignedTo: 'bot_1',
                  },
                  {
                    '@id': '/api/tasks/2',
                    id: 2,
                    isAssigned: true,
                    assignedTo: 'bot_1',
                  },
                ],
                username: 'bot_1',
              },
              {
                '@id': '/api/task_lists/31',
                '@type': 'TaskList',
                items: [],
                username: 'bot_12',
              },
            ],
          },
        ),
      ).toEqual({
        ids: ['/api/tasks/1', '/api/tasks/2'],
        entities: {
          '/api/tasks/1': {
            '@id': '/api/tasks/1',
            id: 1,
            isAssigned: true,
            assignedTo: 'bot_1',
          },
          '/api/tasks/2': {
            '@id': '/api/tasks/2',
            id: 2,
            isAssigned: true,
            assignedTo: 'bot_1',
          },
        },
      });
    });
  });

  describe('CREATE_TASK_SUCCESS', () => {
    it('should add item', () => {
      expect(
        taskEntityReducers(
          {
            ids: [],
            entities: {},
          },
          {
            type: 'CREATE_TASK_SUCCESS',
            payload: {
              '@id': '/api/tasks/1',
              id: 1,
              isAssigned: false,
            },
          },
        ),
      ).toEqual({
        ids: ['/api/tasks/1'],
        entities: {
          '/api/tasks/1': {
            '@id': '/api/tasks/1',
            id: 1,
            isAssigned: false,
          },
        },
      });
    });
  });
});
