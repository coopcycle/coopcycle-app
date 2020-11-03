import { default as taskListEntityReducers } from '../taskListEntityReducers'

describe('taskListEntityReducers', () => {
  describe('CHANGE_DATE', () => {
    it('should remove old items when the date is selected', () => {
      let initialItems = new Map()
      initialItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        'username': 'bot_1',
        itemIds: [
        ]
      })

      expect(taskListEntityReducers(
        {
          items: initialItems,
        },
        {
          type: 'CHANGE_DATE',
          payload: '2020-11-03T23:00:00.000Z',
        }
      )).toEqual({
        items: new Map(),
      })
    })
  })

  describe('LOAD_TASK_LISTS_SUCCESS', () => {
    it('should add items', () => {
      let initialItems = new Map()

      let expectedItems = new Map()
      expectedItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/1',
          '/api/tasks/2',
        ],
        username: 'bot_1',
      })
      expectedItems.set('bot_12', {
        '@id': '/api/task_lists/31',
        '@type': 'TaskList',
        itemIds: [],
        username: 'bot_12',
      })

      expect(taskListEntityReducers(
        {
          items: initialItems,
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
        items: expectedItems,
      })
    })

    it('should update items', () => {
      let initialItems = new Map()
      initialItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/2',
          '/api/tasks/1',
        ],
        username: 'bot_1',
      })
      initialItems.set('bot_12', {
        '@id': '/api/task_lists/31',
        '@type': 'TaskList',
        itemIds: [],
        username: 'bot_12',
      })

      let expectedItems = new Map()
      expectedItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/1',
          '/api/tasks/2',
        ],
        username: 'bot_1',
      })
      expectedItems.set('bot_12', {
        '@id': '/api/task_lists/31',
        '@type': 'TaskList',
        itemIds: [],
        username: 'bot_12',
      })

      expect(taskListEntityReducers(
        {
          items: initialItems,
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
        items: expectedItems,
      })
    })
  })

  describe('CREATE_TASK_SUCCESS', () => {
    it('should add a task into a task list', () => {
      let initialItems = new Map()
      initialItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
        ],
        username: 'bot_1',
      })

      let expectedItems = new Map()
      expectedItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/1',
        ],
        username: 'bot_1',
      })

      expect(taskListEntityReducers(
        {
          items: initialItems,
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
        items: expectedItems,
      })
    })
  })

  describe('ASSIGN_TASK_SUCCESS', () => {
    it('should handle task:assigned event with existing task list', () => {
      let initialItems = new Map()
      initialItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/2',
        ],
        username: 'bot_1',
      })

      let expectedItems = new Map()
      expectedItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/2',
          '/api/tasks/1',
        ],
        username: 'bot_1',
      })

      expect(taskListEntityReducers(
        {
          items: initialItems,
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
        items: expectedItems,
      })
    })

    it('should handle task:assigned event with non-existing task list', () => {
      let initialItems = new Map()

      let expectedItems = new Map()
      expectedItems.set('bot_1', {
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
      })

      expect(taskListEntityReducers(
        {
          items: initialItems,
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
        items: expectedItems,
      })
    })

    it('should re-assign task, if it was assigned to another courier', () => {
      let initialItems = new Map()
      initialItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
        ],
        username: 'bot_1',
      })
      initialItems.set('bot_2', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/1',
        ],
        username: 'bot_2',
      })

      let expectedItems = new Map()
      expectedItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/1',
        ],
        username: 'bot_1',
      })
      expectedItems.set('bot_2', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
        ],
        username: 'bot_2',
      })

      expect(taskListEntityReducers(
        {
          items: initialItems,
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
        items: expectedItems,
      })
    })

    it('should not modify a task list if the task is already there', () => {
      let initialItems = new Map()
      initialItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/2',
          '/api/tasks/1',
          '/api/tasks/3',
        ],
        username: 'bot_1',
      })

      let expectedItems = new Map()
      expectedItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/2',
          '/api/tasks/1',
          '/api/tasks/3',
        ],
        username: 'bot_1',
      })

      expect(taskListEntityReducers(
        {
          items: initialItems,
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
        items: expectedItems,
      })
    })
  })

  describe('UNASSIGN_TASK_SUCCESS', () => {
    it('should remove task from task list when task:unassigned message is received', () => {
      let initialItems = new Map()
      initialItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
          '/api/tasks/1',
        ],
        username: 'bot_1',
      })

      let expectedItems = new Map()
      expectedItems.set('bot_1', {
        '@id': '/api/task_lists/1',
        '@type': 'TaskList',
        itemIds: [
        ],
        username: 'bot_1',
      })

      expect(taskListEntityReducers(
        {
          items: initialItems,
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
        items: expectedItems,
      })
    })
  })

})
