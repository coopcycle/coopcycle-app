import { default as taskListEntityReducers } from '../taskListEntityReducers';

describe('taskListEntityReducers', () => {
  describe('CHANGE_DATE', () => {
    it('should remove old items when the date is selected', () => {
      expect(
        taskListEntityReducers(
          {
            ids: ['bot_1'],
            entities: {
              '/api/task_lists/1': {
                '@id': '/api/task_lists/1',
                username: 'bot_1',
                itemIds: [],
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

  describe('LOAD_TASK_LISTS_SUCCESS', () => {
    describe('empty store', () => {
      it('should add items', () => {
        expect(
          taskListEntityReducers(
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
          ids: ['bot_1', 'bot_12'],
          entities: {
            bot_1: {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: ['/api/tasks/1', '/api/tasks/2'],
              username: 'bot_1',
            },
            bot_12: {
              '@id': '/api/task_lists/31',
              '@type': 'TaskList',
              itemIds: [],
              username: 'bot_12',
            },
          },
        });
      });
    });

    describe('has task lists with @id', () => {
      it('should update items', () => {
        expect(
          taskListEntityReducers(
            {
              ids: ['bot_1', 'bot_12'],
              entities: {
                bot_1: {
                  '@id': '/api/task_lists/1',
                  '@type': 'TaskList',
                  itemIds: ['/api/tasks/2', '/api/tasks/1'],
                  username: 'bot_1',
                },
                bot_12: {
                  '@id': '/api/task_lists/31',
                  '@type': 'TaskList',
                  itemIds: [],
                  username: 'bot_12',
                },
              },
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
          ids: ['bot_1', 'bot_12'],
          entities: {
            bot_1: {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: ['/api/tasks/1', '/api/tasks/2'],
              username: 'bot_1',
            },
            bot_12: {
              '@id': '/api/task_lists/31',
              '@type': 'TaskList',
              itemIds: [],
              username: 'bot_12',
            },
          },
        });
      });
    });
  });

  describe('CREATE_TASK_SUCCESS', () => {
    describe('task is assigned', () => {
      it('should add a task into a task list', () => {
        expect(
          taskListEntityReducers(
            {
              ids: ['bot_1'],
              entities: {
                bot_1: {
                  '@id': '/api/task_lists/1',
                  '@type': 'TaskList',
                  itemIds: [],
                  username: 'bot_1',
                },
              },
            },
            {
              type: 'CREATE_TASK_SUCCESS',
              payload: {
                '@id': '/api/tasks/1',
                id: 1,
                isAssigned: true,
                assignedTo: 'bot_1',
              },
            },
          ),
        ).toEqual({
          ids: ['bot_1'],
          entities: {
            bot_1: {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: ['/api/tasks/1'],
              username: 'bot_1',
            },
          },
        });
      });
    });

    describe('task is NOT assigned', () => {
      it('should ignore action', () => {
        expect(
          taskListEntityReducers(
            {
              ids: ['bot_1'],
              entities: {
                bot_1: {
                  '@id': '/api/task_lists/1',
                  '@type': 'TaskList',
                  itemIds: [],
                  username: 'bot_1',
                },
              },
            },
            {
              type: 'CREATE_TASK_SUCCESS',
              payload: {
                '@id': '/api/tasks/1',
                id: 1,
                isAssigned: false,
                assignedTo: null,
              },
            },
          ),
        ).toEqual({
          ids: ['bot_1'],
          entities: {
            bot_1: {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: [],
              username: 'bot_1',
            },
          },
        });
      });
    });
  });

  describe('ASSIGN_TASK_SUCCESS', () => {
    it('should handle task:assigned event with existing task list', () => {
      expect(
        taskListEntityReducers(
          {
            ids: ['bot_1'],
            entities: {
              bot_1: {
                '@id': '/api/task_lists/1',
                '@type': 'TaskList',
                itemIds: ['/api/tasks/2'],
                username: 'bot_1',
              },
            },
          },
          {
            type: 'ASSIGN_TASK_SUCCESS',
            payload: {
              '@id': '/api/tasks/1',
              id: 1,
              isAssigned: true,
              assignedTo: 'bot_1',
            },
          },
        ),
      ).toEqual({
        ids: ['bot_1'],
        entities: {
          bot_1: {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: ['/api/tasks/2', '/api/tasks/1'],
            username: 'bot_1',
          },
        },
      });
    });

    it('should handle task:assigned event with non-existing task list', () => {
      expect(
        taskListEntityReducers(
          {
            ids: [],
            entities: {},
          },
          {
            type: 'ASSIGN_TASK_SUCCESS',
            payload: {
              '@id': '/api/tasks/1',
              id: 1,
              isAssigned: true,
              assignedTo: 'bot_1',
            },
          },
        ),
      ).toEqual({
        ids: ['bot_1'],
        entities: {
          bot_1: {
            '@context': '/api/contexts/TaskList',
            '@id': 'temp_bot_1',
            '@type': 'TaskList',
            itemIds: ['/api/tasks/1'],
            distance: 0,
            duration: 0,
            polyline: '',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            username: 'bot_1',
          },
        },
      });
    });

    it('should re-assign task, if it was assigned to another courier', () => {
      expect(
        taskListEntityReducers(
          {
            ids: ['bot_1', 'bot_2'],
            entities: {
              bot_1: {
                '@id': '/api/task_lists/1',
                '@type': 'TaskList',
                itemIds: [],
                username: 'bot_1',
              },
              bot_2: {
                '@id': '/api/task_lists/2',
                '@type': 'TaskList',
                itemIds: ['/api/tasks/1'],
                username: 'bot_2',
              },
            },
          },
          {
            type: 'ASSIGN_TASK_SUCCESS',
            payload: {
              '@id': '/api/tasks/1',
              id: 1,
              isAssigned: true,
              assignedTo: 'bot_1',
            },
          },
        ),
      ).toEqual({
        ids: ['bot_1', 'bot_2'],
        entities: {
          bot_1: {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: ['/api/tasks/1'],
            username: 'bot_1',
          },
          bot_2: {
            '@id': '/api/task_lists/2',
            '@type': 'TaskList',
            itemIds: [],
            username: 'bot_2',
          },
        },
      });
    });

    it('should not modify a task list if the task is already there', () => {
      expect(
        taskListEntityReducers(
          {
            ids: ['bot_1'],
            entities: {
              bot_1: {
                '@id': '/api/task_lists/1',
                '@type': 'TaskList',
                itemIds: ['/api/tasks/2', '/api/tasks/1', '/api/tasks/3'],
                username: 'bot_1',
              },
            },
          },
          {
            type: 'ASSIGN_TASK_SUCCESS',
            payload: {
              '@id': '/api/tasks/1',
              id: 1,
              isAssigned: true,
              assignedTo: 'bot_1',
            },
          },
        ),
      ).toEqual({
        ids: ['bot_1'],
        entities: {
          bot_1: {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: ['/api/tasks/2', '/api/tasks/1', '/api/tasks/3'],
            username: 'bot_1',
          },
        },
      });
    });
  });

  describe('UNASSIGN_TASK_SUCCESS', () => {
    it('should remove task from task list when task:unassigned message is received', () => {
      expect(
        taskListEntityReducers(
          {
            ids: ['bot_1'],
            entities: {
              bot_1: {
                '@id': '/api/task_lists/1',
                '@type': 'TaskList',
                itemIds: ['/api/tasks/1'],
                username: 'bot_1',
              },
            },
          },
          {
            type: 'UNASSIGN_TASK_SUCCESS',
            payload: {
              '@id': '/api/tasks/1',
              id: 1,
              isAssigned: false,
              assignedTo: null,
            },
          },
        ),
      ).toEqual({
        ids: ['bot_1'],
        entities: {
          bot_1: {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: [],
            username: 'bot_1',
          },
        },
      });
    });
  });
});
