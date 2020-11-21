import { default as taskListEntityReducers } from '../taskListEntityReducers'

describe('taskListEntityReducers', () => {
  describe('CHANGE_DATE', () => {
    it('should remove old items when the date is selected', () => {
      expect(taskListEntityReducers(
        {
          byUsername: {
            'bot_1': {
              '@id': '/api/task_lists/1',
              'username': 'bot_1',
              itemIds: [
              ]
            },
          },
        },
        {
          type: 'CHANGE_DATE',
          payload: '2020-11-03T23:00:00.000Z',
        }
      )).toEqual({
        byUsername: {},
      })
    })
  })

  describe('LOAD_TASK_LISTS_SUCCESS', () => {
    it('should add items', () => {
      expect(taskListEntityReducers(
        {
          byUsername: {},
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
                  id : 1,
                  isAssigned: true,
                  assignedTo: 'bot_1',
                },
                {
                  '@id': '/api/tasks/2',
                  id : 2,
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
        }
      )).toEqual({
        byUsername: {
          'bot_1': {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: [
              '/api/tasks/1',
              '/api/tasks/2',
            ],
            username: 'bot_1',
          },
          'bot_12': {
            '@id': '/api/task_lists/31',
            '@type': 'TaskList',
            itemIds: [],
            username: 'bot_12',
          },
        },
      })
    })

    it('should update items', () => {
      expect(taskListEntityReducers(
        {
          byUsername: {
            'bot_1': {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: [
                '/api/tasks/2',
                '/api/tasks/1',
              ],
              username: 'bot_1',
            },
            'bot_12': {
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
                  id : 1,
                  isAssigned: true,
                  assignedTo: 'bot_1',
                },
                {
                  '@id': '/api/tasks/2',
                  id : 2,
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
        }
      )).toEqual({
        byUsername: {
          'bot_1': {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: [
              '/api/tasks/1',
              '/api/tasks/2',
            ],
            username: 'bot_1',
          },
          'bot_12': {
            '@id': '/api/task_lists/31',
            '@type': 'TaskList',
            itemIds: [],
            username: 'bot_12',
          },
        },
      })
    })
  })

  describe('CREATE_TASK_SUCCESS', () => {
    it('should add a task into a task list', () => {
      expect(taskListEntityReducers(
        {
          byUsername: {
            'bot_1': {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: [
              ],
              username: 'bot_1',
            },
          },
        },
        {
          type: 'CREATE_TASK_SUCCESS',
          payload: {
            '@id': '/api/tasks/1',
            id : 1,
            isAssigned: true,
            assignedTo: 'bot_1',
          },
        }
      )).toEqual({
        byUsername: {
          'bot_1': {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: [
              '/api/tasks/1',
            ],
            username: 'bot_1',
          },
        },
      })
    })
  })

  describe('ASSIGN_TASK_SUCCESS', () => {
    it('should handle task:assigned event with existing task list', () => {
      expect(taskListEntityReducers(
        {
          byUsername: {
            'bot_1': {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: [
                '/api/tasks/2',
              ],
              username: 'bot_1',
            },
          },
        },
        {
          type: 'ASSIGN_TASK_SUCCESS',
          payload: {
            '@id': '/api/tasks/1',
            id : 1,
            isAssigned: true,
            assignedTo: 'bot_1',
          },
        }
      )).toEqual({
        byUsername: {
          'bot_1': {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: [
              '/api/tasks/2',
              '/api/tasks/1',
            ],
            username: 'bot_1',
          },
        },
      })
    })

    it('should handle task:assigned event with non-existing task list', () => {
      expect(taskListEntityReducers(
        {
          byUsername: {},
        },
        {
          type: 'ASSIGN_TASK_SUCCESS',
          payload: {
            '@id': '/api/tasks/1',
            id : 1,
            isAssigned: true,
            assignedTo: 'bot_1',
          },
        }
      )).toEqual({
        byUsername: {
          'bot_1': {
            '@context': '/api/contexts/TaskList',
            '@id': null,
            '@type': 'TaskList',
            itemIds: [
              '/api/tasks/1',
            ],
            distance: 0,
            duration: 0,
            polyline: '',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            username: 'bot_1',
          },
        },
      })
    })

    it('should re-assign task, if it was assigned to another courier', () => {
      expect(taskListEntityReducers(
        {
          byUsername: {
            'bot_1': {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: [
              ],
              username: 'bot_1',
            },
            'bot_2': {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: [
                '/api/tasks/1',
              ],
              username: 'bot_2',
            },
          },
        },
        {
          type: 'ASSIGN_TASK_SUCCESS',
          payload: {
            '@id': '/api/tasks/1',
            id : 1,
            isAssigned: true,
            assignedTo: 'bot_1',
          },
        }
      )).toEqual({
        byUsername: {
          'bot_1': {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: [
              '/api/tasks/1',
            ],
            username: 'bot_1',
          },
          'bot_2': {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: [
            ],
            username: 'bot_2',
          },
        },
      })
    })

    it('should not modify a task list if the task is already there', () => {
      expect(taskListEntityReducers(
        {
          byUsername: {
            'bot_1': {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: [
                '/api/tasks/2',
                '/api/tasks/1',
                '/api/tasks/3',
              ],
              username: 'bot_1',
            },
          },
        },
        {
          type: 'ASSIGN_TASK_SUCCESS',
          payload: {
            '@id': '/api/tasks/1',
            id : 1,
            isAssigned: true,
            assignedTo: 'bot_1',
          },
        }
      )).toEqual({
        byUsername: {
          'bot_1': {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: [
              '/api/tasks/2',
              '/api/tasks/1',
              '/api/tasks/3',
            ],
            username: 'bot_1',
          },
        },
      })
    })
  })

  describe('UNASSIGN_TASK_SUCCESS', () => {
    it('should remove task from task list when task:unassigned message is received', () => {
      expect(taskListEntityReducers(
        {
          byUsername: {
            'bot_1': {
              '@id': '/api/task_lists/1',
              '@type': 'TaskList',
              itemIds: [
                '/api/tasks/1',
              ],
              username: 'bot_1',
            },
          },
        },
        {
          type: 'UNASSIGN_TASK_SUCCESS',
          payload: {
            '@id': '/api/tasks/1',
            id : 1,
            isAssigned: false,
            assignedTo: null,
          },
        }
      )).toEqual({
        byUsername: {
          'bot_1': {
            '@id': '/api/task_lists/1',
            '@type': 'TaskList',
            itemIds: [
            ],
            username: 'bot_1',
          },
        },
      })
    })
  })

})
