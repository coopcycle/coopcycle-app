import moment from 'moment'
import reducers from '../reducers'
import { message } from '../../middlewares/WebSocketMiddleware'

describe('Redux | Dispatch | Reducers', () => {

  it('should handle task:assigned event with non-existing task list', () => {

    const task = {
      isAssigned: true,
      assignedTo: 'foo',
    }

    const action = message({
      name: 'task:assigned',
      data: { task },
    })

    expect(
      reducers({
        unassignedTasks: [],
        taskLists: [],
      }, action)
    ).toMatchObject({
      unassignedTasks: [],
      taskLists: [
        {
          '@context': '/api/contexts/TaskList',
          '@id': null,
          '@type': 'TaskList',
          distance: 0,
          duration: 0,
          polyline: '',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          username: 'foo',
          items: [ task ],
        },
      ],
    })

  })

  it('should handle task:assigned event with existing task list', () => {

    const task = {
      isAssigned: true,
      assignedTo: 'foo',
    }

    const action = message({
      name: 'task:assigned',
      data: { task },
    })

    expect(
      reducers({
        unassignedTasks: [],
        taskLists: [{
          username: 'foo',
          items: [],
        }],
      }, action)
    ).toMatchObject({
      unassignedTasks: [],
      taskLists: [
        {
          username: 'foo',
          items: [ task ],
        },
      ],
    })

  })

  it('should remove task from unassigned list when task:assigned message is received', () => {

    const task = {
      '@id': '/api/tasks/1',
      isAssigned: true,
      assignedTo: 'foo',
    }

    const action = message({
      name: 'task:assigned',
      data: { task },
    })

    expect(
      reducers({
        unassignedTasks: [
          { '@id': '/api/tasks/1' },
        ],
        taskLists: [{
          username: 'foo',
          items: [],
        }],
      }, action)
    ).toMatchObject({
      unassignedTasks: [],
      taskLists: [
        {
          username: 'foo',
          items: [ task ],
        },
      ],
    })

  })

  it('should remove task from task list when task:unassigned message is received', () => {

    const task = {
      '@id': '/api/tasks/1',
      isAssigned: false,
      assignedTo: null,
    }

    const action = message({
      name: 'task:unassigned',
      data: { task },
    })

    expect(
      reducers({
        unassignedTasks: [],
        taskLists: [
          {
            username: 'foo',
            items: [
              { '@id': '/api/tasks/1' },
            ],
          },
        ],
      }, action)
    ).toMatchObject({
      unassignedTasks: [ task ],
      taskLists: [
        {
          username: 'foo',
          items: [],
        },
      ],
    })

  })

  it('should handle task:created event (with legacy prop)', () => {

    const task = {
      '@id': '/api/tasks/1',
      isAssigned: false,
      doneBefore: moment('2020-04-16 20:00:00').format(),
    }

    const action = message({
      name: 'task:created',
      data: { task },
    })

    expect(
      reducers({
        date: moment('2020-04-16'),
        unassignedTasks: [],
        taskLists: [],
      }, action)
    ).toMatchObject({
      date: moment('2020-04-16'),
      unassignedTasks: [ task ],
      taskLists: [],
    })

  })

  it('should handle task:created event with different date (with legacy prop)', () => {

    const task = {
      '@id': '/api/tasks/1',
      isAssigned: false,
      doneBefore: moment('2020-04-17 20:00:00').format(),
    }

    const action = message({
      name: 'task:created',
      data: { task },
    })

    expect(
      reducers({
        date: moment('2020-04-16'),
        unassignedTasks: [],
        taskLists: [],
      }, action)
    ).toMatchObject({
      date: moment('2020-04-16'),
      unassignedTasks: [],
      taskLists: [],
    })

  })

})
