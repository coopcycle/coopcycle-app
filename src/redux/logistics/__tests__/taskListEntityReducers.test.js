import {
  loadTaskListsSuccess,
} from '../../Dispatch/actions';
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
            loadTaskListsSuccess([
              {
                '@id': '/api/task_lists/1',
                '@type': 'TaskList',
                items: ['/api/tasks/1', '/api/tasks/2',],
                username: 'bot_1',
              },
              {
                '@id': '/api/task_lists/31',
                '@type': 'TaskList',
                items: [],
                username: 'bot_12',
              },
            ]),
          )).toEqual({
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
            loadTaskListsSuccess([
              {
                '@id': '/api/task_lists/1',
                '@type': 'TaskList',
                items: ['/api/tasks/1', '/api/tasks/2',],
                username: 'bot_1',
              },
              {
                '@id': '/api/task_lists/31',
                '@type': 'TaskList',
                items: [],
                username: 'bot_12',
              },
            ])
          )).toEqual({
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
});
