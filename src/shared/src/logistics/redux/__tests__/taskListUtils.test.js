import { replaceItemsWithItemIds } from '../taskListUtils.js';
import { tasksListsToEdit } from '../taskListUtils.js';

const getTask = (id) => {
  return (
    {
      '@id': `/api/tasks/${id}`,
      id: id,
    }
  )
}

describe('taskListUtils', () => {
  describe('replaceItemsWithItemIds', () => {
    it('should remove items and add itemIds in a task list', () => {
      let taskList = {
        '@id': '/api/task_lists/1',
        username: 'bot_1',
        items: ['/api/tasks/1', '/api/tasks/2', ],
      };

      let result = replaceItemsWithItemIds(taskList);

      expect(result).toEqual({
        '@id': '/api/task_lists/1',
        username: 'bot_1',
        itemIds: ['/api/tasks/1', '/api/tasks/2'],
      });
      expect(result).not.toBe(taskList);
    });
  });
  describe('tasksListsToEdit', () => {
    it('should retun an empty object when nothing has been selected', () => {
      const selectedTasks = {
        orders: {},
        tasks: {},
      }

      const result = tasksListsToEdit(selectedTasks)

      expect(result).toEqual({})
    });
    it('should retun an object with tasks of just one taskLists', () => {
      const selectedTasks = {
        orders: {},
        tasks: {
          '/api/task_lists/1': [getTask(1), getTask(2)]
        },
      }

      let result = tasksListsToEdit(selectedTasks)

      expect(result).toEqual({
        '/api/task_lists/1': [getTask(1), getTask(2)]
      })
    });
    it('should retun an object with tasks order by taskLists', () => {
      const selectedTasks = {
        orders: {},
        tasks: {
          '/api/task_lists/1': [getTask(1), getTask(2)],
          '/api/task_lists/2': [getTask(3), getTask(4)],
          '/api/task_lists/3': [getTask(5), getTask(6), getTask(7)]
        },
      }

      let result = tasksListsToEdit(selectedTasks)

      expect(result).toEqual({
        '/api/task_lists/1': [getTask(1), getTask(2)],
          '/api/task_lists/2': [getTask(3), getTask(4)],
          '/api/task_lists/3': [getTask(5), getTask(6), getTask(7)]
      })
    });
  })
});
