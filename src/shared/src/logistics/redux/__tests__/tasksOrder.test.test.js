import moment from 'moment';
import { selectTaskLists } from '../selectors';

describe('TaskOrder', () => {

    let date = moment().format('YYYY-MM-DD');

    let baseState = {
    logistics: {
      date,
      entities: {
        tasks: {
          ids: ['/api/tasks/1', '/api/tasks/2', '/api/tasks/3', '/api/tasks/4', '/api/tasks/5', '/api/tasks/6', '/api/tasks/7'],
          entities: {
            // Tarea suelta
            '/api/tasks/1': { '@id': '/api/tasks/1', id: 1, isAssigned: true },

            // Tour con dos tareas
            '/api/tasks/2': { '@id': '/api/tasks/2', id: 2, isAssigned: true },
            '/api/tasks/3': { '@id': '/api/tasks/3', id: 3, isAssigned: true },

            // Otra tarea suelta
            '/api/tasks/4': { '@id': '/api/tasks/4', id: 4, isAssigned: true },

            // Tour con una tarea
            '/api/tasks/5': { '@id': '/api/tasks/5', id: 5, isAssigned: true },

            // Grupo de dos tareas
            '/api/tasks/6': { '@id': '/api/tasks/6', id: 6, isAssigned: true, next: '/api/tasks/7' },
            '/api/tasks/7': { '@id': '/api/tasks/7', id: 7, isAssigned: true, previous: '/api/tasks/6' },
          },
        },
        taskLists: {
          ids: ['/api/task_lists/1', '/api/task_lists/2'],
          entities: {
            '/api/task_lists/1': {
              '@id': '/api/task_lists/1',
              username: 'bot_alpha',
              itemIds: [
                '/api/tasks/1', // tarea
                '/api/tours/1', // tour con 2
                '/api/tasks/4', // tarea
              ],
            },
            '/api/task_lists/2': {
              '@id': '/api/task_lists/2',
              username: 'bot_beta',
              itemIds: [
                '/api/tours/2',      // tour con 1
                '/api/tasks/5',      // tarea
                '/api/tasks/6',      // primera del grupo
                '/api/tasks/7',      // segunda del grupo
              ],
            },
          },
        },
        tours: {
          ids: ['/api/tours/1', '/api/tours/2'],
          entities: {
            '/api/tours/1': {
              '@id': '/api/tours/1',
              items: ['/api/tasks/2', '/api/tasks/3'], // tour con 2
            },
            '/api/tours/2': {
              '@id': '/api/tours/2',
              items: ['/api/tasks/5'], // tour con 1
            },
          },
        },
      },
      ui: {
        taskListsLoading: false,
      },
    },
  };

  it('should return task list 1 in expected order', () => {
    const [list1] = selectTaskLists(baseState);
    expect(list1.items).toEqual([
      { '@id': '/api/tasks/1', id: 1, isAssigned: true },
      { '@id': '/api/tasks/2', id: 2, isAssigned: true },
      { '@id': '/api/tasks/3', id: 3, isAssigned: true },
      { '@id': '/api/tasks/4', id: 4, isAssigned: true },
    ]);
  });

  it('should return task list 2 in expected order', () => {
    const [, list2] = selectTaskLists(baseState);
    expect(list2.items).toEqual([
      { '@id': '/api/tasks/5', id: 5, isAssigned: true },
      { '@id': '/api/tasks/6', id: 6, isAssigned: true, next: '/api/tasks/7' },
      { '@id': '/api/tasks/7', id: 7, isAssigned: true, previous: '/api/tasks/6' },
    ]);
  });
});
