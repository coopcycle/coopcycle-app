import { createTaskSuccess } from '../../../shared/logistics/redux';
import {
  changeDate,
  loadTasksSuccess,
} from '../../Dispatch/actions';
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
          changeDate('2020-11-03T23:00:00.000Z'),
        )
      ).toEqual({
        ids: [],
        entities: {},
      });
    });
  });

  describe('LOAD_TASKS_SUCCESS', () => {
    it('should add items', () => {
      expect(
        taskEntityReducers(
          {
            ids: [],
            entities: {},
          },
          loadTasksSuccess([
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
          ]),
        )
      ).toEqual({
        ids: ['/api/tasks/1', '/api/tasks/2'],
        entities: {
          '/api/tasks/1': {
            '@id': '/api/tasks/1',
            id: 1,
            isAssigned: false,
            color: '#ffffff',
          },
          '/api/tasks/2': {
            '@id': '/api/tasks/2',
            id: 2,
            isAssigned: false,
            color: '#ffffff',
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
          loadTasksSuccess([
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
          ]),
        ),
      ).toEqual({
        ids: ['/api/tasks/1', '/api/tasks/2'],
        entities: {
          '/api/tasks/1': {
            '@id': '/api/tasks/1',
            id: 1,
            isAssigned: false,
            comments: 'new comment',
            color: '#ffffff',
          },
          '/api/tasks/2': {
            '@id': '/api/tasks/2',
            id: 2,
            isAssigned: false,
            comments: 'new comment',
            color: '#ffffff',
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
          createTaskSuccess({
            '@id': '/api/tasks/1',
            id: 1,
            isAssigned: false,
          }),
        ),
      ).toEqual({
        ids: ['/api/tasks/1'],
        entities: {
          '/api/tasks/1': {
            '@id': '/api/tasks/1',
            id: 1,
            isAssigned: false,
            color: '#ffffff',
          },
        },
      });
    });
  });
});
