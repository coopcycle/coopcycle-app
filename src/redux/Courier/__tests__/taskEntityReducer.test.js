import { omit } from 'lodash';
import moment from 'moment';

import { _message } from '../../middlewares/CentrifugoMiddleware/actions';
import {
  changeDate,
  loadTasksFailure,
  loadTasksRequest,
  loadTasksSuccess,
} from '../taskActions';
import { markTasksDoneSuccess } from '../taskActions';
import {
  markTaskDoneFailure,
  markTaskDoneRequest,
  markTaskDoneSuccess,
  markTaskFailedFailure,
  markTaskFailedRequest,
  markTaskFailedSuccess,
} from '../../../shared/logistics/redux';
import { tasksEntityReducer } from '../taskEntityReducer';
import {
  selectIsTaskCompleteFailure,
  selectIsTasksLoading,
  selectIsTasksLoadingFailure,
  selectTasks,
} from '../taskSelectors';

// As we may be using setTimeout(), we need to mock timers
// @see https://jestjs.io/docs/en/timer-mocks.html
jest.useFakeTimers();

describe('Redux | Tasks | Reducers', () => {
  const initialState = tasksEntityReducer();

  describe('tasksEntityReducer', () => {
    [loadTasksRequest, markTaskDoneRequest, markTaskFailedRequest].forEach(
      actionCreator => {
        test(`${actionCreator}`, () => {
          const prevState = {
            ...initialState,
            fetchError: true,
          };
          const newState = tasksEntityReducer(prevState, actionCreator());
          const fullState = { entities: { tasks: newState } };

          const restOldState = omit(prevState, ['fetchError', 'isFetching']);
          const restNewState = omit(newState, ['fetchError', 'isFetching']);

          expect(restOldState).toEqual(restNewState);
          expect(selectIsTasksLoading(fullState)).toEqual(true);
          expect(selectIsTasksLoadingFailure(fullState)).toEqual(false);
        });
      },
    );

    test(`${loadTasksFailure}`, () => {
      const error = new Error('test error');
      const prevState = {
        ...initialState,
        isFetching: true,
      };
      const newState = tasksEntityReducer(prevState, loadTasksFailure(error));
      const fullState = { entities: { tasks: newState } };

      const restOldState = omit(prevState, [
        'loadTasksFetchError',
        'isFetching',
      ]);
      const restNewState = omit(newState, [
        'loadTasksFetchError',
        'isFetching',
      ]);

      expect(restOldState).toEqual(restNewState);
      expect(selectIsTasksLoading(fullState)).toEqual(false);
      expect(selectIsTasksLoadingFailure(fullState)).toEqual(error);
    });

    [markTaskDoneFailure, markTaskFailedFailure].forEach(actionCreator => {
      test(`${actionCreator}`, () => {
        const error = new Error('test error');
        const prevState = {
          ...initialState,
          isFetching: true,
        };
        const newState = tasksEntityReducer(prevState, actionCreator(error));
        const fullState = { entities: { tasks: newState } };

        const restOldState = omit(prevState, [
          'completeTaskFetchError',
          'isFetching',
        ]);
        const restNewState = omit(newState, [
          'completeTaskFetchError',
          'isFetching',
        ]);

        expect(restOldState).toEqual(restNewState);
        expect(selectIsTasksLoading(fullState)).toEqual(false);
        expect(selectIsTaskCompleteFailure(fullState)).toEqual(error);
      });
    });

    test(`${loadTasksSuccess}`, () => {
      const tasks = [
        { id: 1, assignedTo: 'bob', color: '#ffffff' },
        { id: 2, assignedTo: 'bob', color: '#ffffff' },
      ];
      const prevState = {
        ...initialState,
        loadTasksFetchError: true,
        isFetching: true,
      };
      const now = moment();
      const date = now.format('YYYY-MM-DD');
      const newState = tasksEntityReducer(
        prevState,
        loadTasksSuccess(date, tasks, now.toISOString()),
      );
      const fullState = { entities: { tasks: newState } };

      const restOldState = omit(prevState, [
        'loadTasksFetchError',
        'isFetching',
        'items',
        'tours',
        'updatedAt',
      ]);
      const restNewState = omit(newState, [
        'loadTasksFetchError',
        'isFetching',
        'items',
        'tours',
        'updatedAt',
      ]);

      expect(selectIsTasksLoading(fullState)).toBe(false);
      expect(selectIsTasksLoadingFailure(fullState)).toBe(false);
      expect(selectTasks(fullState)).toEqual(tasks);
      // A flat payload — what an instance without tours support answers —
      // leaves the day with no tour to group by.
      expect(newState.tours[date]).toEqual({ tours: {}, tasks: {} });

      expect(restOldState).toEqual({ ...restNewState, date });
    });

    [markTaskDoneSuccess, markTaskFailedSuccess].forEach(actionCreator => {
      test(`${actionCreator}`, () => {
        const task = { id: 1, foo: 'bar', color: '#ffffff' };
        const date = moment().format('YYYY-MM-DD');
        const prevState = {
          ...initialState,
          date,
          items: {
            [date]: [task],
          },
        };

        const newState = tasksEntityReducer(
          prevState,
          actionCreator({ ...task, foo: 'foo' }),
        );
        const fullState = { entities: { tasks: newState } };

        const restOldState = omit(prevState, ['items']);
        const restNewState = omit(newState, ['items']);
        const { isFetching } = newState;

        expect(selectTasks(fullState)).toEqual([{ ...task, foo: 'foo' }]);

        expect(restOldState).toEqual(restNewState);
        expect(isFetching).toBeFalsy();
      });
    });

    test(`${_message} | tasks:changed (deprecated)`, () => {
      const date = moment().format('YYYY-MM-DD');

      const wsMsg = { name: 'tasks:changed', data: { date } };

      const prevState = {
        ...initialState,
        date,
        items: {
          [date]: [{ '@id': '/api/tasks/1' }, { '@id': '/api/tasks/2' }],
        },
      };

      const newState = tasksEntityReducer(prevState, _message(wsMsg));
      const fullState = { entities: { tasks: newState } };

      const restOldState = omit(prevState, ['items']);
      const restNewState = omit(newState, ['items']);

      expect(newState).toEqual(prevState);
    });

    test(`${_message} | task_list:updated`, () => {
      const date = moment().format('YYYY-MM-DD');
      const username = 'some_username';

      const oldTasks = [{ '@id': '/api/tasks/1' }, { '@id': '/api/tasks/2' }];
      const newTasks = [
        { '@id': '/api/tasks/1', color: '#ffffff' },
        { '@id': '/api/tasks/2', color: '#ffffff' },
        { '@id': '/api/tasks/3', color: '#ffffff' },
      ];
      const wsMsg = {
        name: 'task_list:updated',
        data: {
          task_list: {
            date,
            items: newTasks,
            username,
          },
        },
      };

      const prevState = {
        ...initialState,
        date,
        items: {
          [date]: oldTasks,
        },
        username,
      };

      const newState = tasksEntityReducer(prevState, _message(wsMsg));
      const fullState = { entities: { tasks: newState } };

      const restOldState = omit(prevState, ['items']);
      const restNewState = omit(newState, ['items']);

      expect(selectTasks(fullState)).toEqual(newTasks);
      expect(restOldState).toEqual(restNewState);
    });

    test(`${changeDate} | follows the date selected in the UI`, () => {
      const prevState = { ...initialState, date: '2020-01-01' };
      const newState = tasksEntityReducer(
        prevState,
        changeDate(moment('2020-02-03T14:30:00').toISOString()),
      );

      // `selectTasks` reads the bucket named by this date, and the RTK query
      // serves an already-cached date without dispatching anything, so the
      // date has to follow the selection rather than a request.
      expect(newState.date).toEqual('2020-02-03');
      expect(omit(newState, ['date'])).toEqual(omit(prevState, ['date']));
    });

    describe('state identity', () => {
      const date = moment().format('YYYY-MM-DD');
      const tasks = [
        { '@id': '/api/tasks/1', id: 1, status: 'TODO', color: '#ffffff' },
        { '@id': '/api/tasks/2', id: 2, status: 'TODO', color: '#ffffff' },
      ];
      const otherDate = moment().add(1, 'day').format('YYYY-MM-DD');
      const otherTasks = [
        { '@id': '/api/tasks/9', id: 9, status: 'TODO', color: '#ffffff' },
      ];

      const stateWithTasks = () => ({
        ...initialState,
        date,
        items: { [date]: tasks, [otherDate]: otherTasks },
      });

      test(`${markTaskDoneSuccess} | leaves untouched days alone`, () => {
        const prevState = stateWithTasks();
        const newState = tasksEntityReducer(
          prevState,
          markTaskDoneSuccess({ ...tasks[0], status: 'DONE' }),
        );

        // The day holding the task is rebuilt...
        expect(newState.items[date]).not.toBe(prevState.items[date]);
        expect(newState.items[date][0].status).toEqual('DONE');
        // ...every other day keeps its identity, so nothing memoized on it
        // recomputes and redux-persist has nothing new to serialize for it.
        expect(newState.items[otherDate]).toBe(prevState.items[otherDate]);
      });

      test(`${markTaskDoneSuccess} | unknown task leaves items untouched`, () => {
        const prevState = stateWithTasks();
        const newState = tasksEntityReducer(
          prevState,
          markTaskDoneSuccess({ '@id': '/api/tasks/404', id: 404 }),
        );

        expect(newState.items).toBe(prevState.items);
      });

      test(`${markTasksDoneSuccess} | replaces across a day in one pass`, () => {
        const prevState = stateWithTasks();
        const newState = tasksEntityReducer(
          prevState,
          markTasksDoneSuccess([
            { ...tasks[0], status: 'DONE' },
            { ...tasks[1], status: 'DONE' },
          ]),
        );

        expect(newState.items[date].map(t => t.status)).toEqual([
          'DONE',
          'DONE',
        ]);
        expect(newState.items[otherDate]).toBe(prevState.items[otherDate]);
      });

      test(`${loadTasksSuccess} | an unchanged reload keeps items`, () => {
        const prevState = stateWithTasks();
        const loaded = tasksEntityReducer(
          prevState,
          loadTasksSuccess(date, tasks, moment().toISOString()),
        );

        // Loading the very same list again must not hand out new references:
        // that is what re-rendered every list and rewrote the persisted state
        // on each of the refetches around a completion.
        const reloaded = tasksEntityReducer(
          loaded,
          loadTasksSuccess(date, tasks, moment().toISOString()),
        );

        expect(reloaded.items).toBe(loaded.items);
      });

      test(`${loadTasksSuccess} | an unchanged reload keeps tours`, () => {
        const items = [
          {
            '@id': '/api/tours/1',
            '@type': 'Tour',
            id: 1,
            name: 'Centre-ville',
            items: tasks,
          },
        ];

        const loaded = tasksEntityReducer(
          initialState,
          loadTasksSuccess(date, items, moment().toISOString()),
        );
        const reloaded = tasksEntityReducer(
          loaded,
          loadTasksSuccess(date, items, moment().toISOString()),
        );

        expect(reloaded.tours).toBe(loaded.tours);
      });
    });

    test(`${loadTasksSuccess} | nested tours`, () => {
      const date = moment().format('YYYY-MM-DD');
      const tasks = [
        { '@id': '/api/tasks/1', id: 1, status: 'TODO' },
        { '@id': '/api/tasks/2', id: 2, status: 'TODO' },
      ];
      const bareTask = { '@id': '/api/tasks/99', id: 99, status: 'TODO' };
      const items = [
        bareTask,
        {
          '@id': '/api/tours/1',
          '@type': 'Tour',
          id: 1,
          name: 'Centre-ville',
          items: tasks,
        },
      ];

      const newState = tasksEntityReducer(
        initialState,
        loadTasksSuccess(date, items, moment().toISOString()),
      );

      // The tour is flattened into the day's tasks, so every selector, filter
      // and map screen keeps seeing the shape it always saw...
      expect(newState.items[date].map(t => t['@id'])).toEqual([
        '/api/tasks/99',
        ...tasks.map(t => t['@id']),
      ]);

      // ...and the grouping is kept alongside, for display only.
      expect(newState.tours[date].tours).toEqual({
        '/api/tours/1': { '@id': '/api/tours/1', name: 'Centre-ville' },
      });
      expect(newState.tours[date].tasks['/api/tasks/99']).toBeUndefined();
      tasks.forEach(task => {
        expect(newState.tours[date].tasks[task['@id']]).toEqual('/api/tours/1');
      });
    });

    test(`${_message} | unrecognized message type`, () => {
      const prevState = { ...initialState };
      const newState = tasksEntityReducer(
        prevState,
        _message({ type: 'fake' }),
      );

      expect(newState).toEqual(prevState);
    });
  });
});
