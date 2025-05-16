import { replaceItemsWithItemIds } from '../taskListUtils.js';

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
});
