import { default as taskEntityReducers } from '../taskEntityReducers'

describe('taskEntityReducers', () => {
  describe('CHANGE_DATE', () => {
    it('should remove old items when the date is selected', () => {
      let initialItems = new Map()
      initialItems.set('/api/tasks/1', {
        '@id': '/api/tasks/1',
        id : 1,
        isAssigned: false,
      })

      expect(taskEntityReducers(
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

  describe('LOAD_UNASSIGNED_TASKS_SUCCESS', () => {
    it('should add items', () => {
      let initialItems = new Map()

      let expectedItems = new Map()
      expectedItems.set('/api/tasks/1', {
        '@id': '/api/tasks/1',
        id : 1,
        isAssigned: false,
      })

      expectedItems.set('/api/tasks/2', {
        '@id': '/api/tasks/2',
        id : 2,
        isAssigned: false,
      })

      expect(taskEntityReducers(
        {
          items: initialItems,
        },
        {
          type: 'LOAD_UNASSIGNED_TASKS_SUCCESS',
          payload: [
            {
              '@id': '/api/tasks/1',
              id : 1,
              isAssigned: false,
            },
            {
              '@id': '/api/tasks/2',
              id : 2,
              isAssigned: false,
            },
          ],
        }
      )).toEqual({
        items: expectedItems,
      })
    })

    it('should update items', () => {
      let initialItems = new Map()
      initialItems.set('/api/tasks/1', {
        '@id': '/api/tasks/1',
        id : 1,
        isAssigned: false,
      })

      let expectedItems = new Map()
      expectedItems.set('/api/tasks/1', {
        '@id': '/api/tasks/1',
        id : 1,
        isAssigned: false,
        comments: 'new comment',
      })

      expectedItems.set('/api/tasks/2', {
        '@id': '/api/tasks/2',
        id : 2,
        isAssigned: false,
        comments: 'new comment',
      })

      expect(taskEntityReducers(
        {
          items: initialItems,
        },
        {
          type: 'LOAD_UNASSIGNED_TASKS_SUCCESS',
          payload: [
            {
              '@id': '/api/tasks/1',
              id : 1,
              isAssigned: false,
              comments: 'new comment',
            },
            {
              '@id': '/api/tasks/2',
              id : 2,
              isAssigned: false,
              comments: 'new comment',
            },
          ],
        }
      )).toEqual({
        items: expectedItems,
      })
    })
  })

  describe('LOAD_TASK_LISTS_SUCCESS', () => {
    it('should add items', () => {
      let initialItems = new Map()

      let expectedItems = new Map()
      expectedItems.set('/api/tasks/1', {
        '@id': '/api/tasks/1',
        id : 1,
        isAssigned: true,
        assignedTo: 'bot_1',
      })

      expectedItems.set('/api/tasks/2', {
        '@id': '/api/tasks/2',
        id : 2,
        isAssigned: true,
        assignedTo: 'bot_1',
      })

      expect(taskEntityReducers(
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
    it('should add item', () => {
      let initialItems = new Map()

      let expectedItems = new Map()
      expectedItems.set('/api/tasks/1', {
        '@id': '/api/tasks/1',
        id : 1,
        isAssigned: false,
      })

      expect(taskEntityReducers(
        {
          items: initialItems,
        },
        {
          type: 'CREATE_TASK_SUCCESS',
          payload: {
            '@id': '/api/tasks/1',
            id : 1,
            isAssigned: false,
          },
        }
      )).toEqual({
        items: expectedItems,
      })
    })
  })
})
