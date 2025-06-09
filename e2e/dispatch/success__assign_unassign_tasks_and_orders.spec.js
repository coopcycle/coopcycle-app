import {
  assignTaskToUser,
  bulkAssignToUser,
  bulkUnassign,
  doLoginForUserWithRoleDispatcher,
  getTaskTitleElement,
  loadDispatchFixture,
  relaunchCleanApp,
  swipeLeftTask,
  swipeRightTask,
  toggleSectionUnassigned,
  unassignTaskFromUser,
} from './utils';
import { itif } from '../utils';
import { UNASSIGNED_TASKS_LIST_ID } from '../../src/shared/src/constants';

const USERNAME = 'jane';

describe('Dispatch - Assing and unassign tasks and orders (single + bulk)', () => {
  beforeEach(async () => {
    await relaunchCleanApp();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
  });

  itif(device.getPlatform() === 'android')(
    'should assing a single task to a courier and then unassign it',
    async () => {
      // All 3 tasks are unassigned
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");

      // Assign task 2
      await assignTaskToUser(USERNAME, 1);

      // Verify task 1 and 3 were not assigned
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #3");

      // Hide unassigned tasks section
      await toggleSectionUnassigned();

      // Verify task 2 is on USERNAME's task list
      await expect(getTaskTitleElement(`${USERNAME}TasksList`)).toHaveText("Acme - Task #2");

      // Unassign the task
      await unassignTaskFromUser(USERNAME);

      // Show unassigned tasks section
      await toggleSectionUnassigned();

      // Verify all tasks are unassigned
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
    }
  );

  itif(device.getPlatform() === 'android')(
    'should assign two tasks to a courier',
    async () => {
      // All 3 tasks are unassigned
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");

      // Assign task 1 and 3
      await swipeLeftTask(UNASSIGNED_TASKS_LIST_ID, 0);
      await swipeLeftTask(UNASSIGNED_TASKS_LIST_ID, 2);
      await bulkAssignToUser(USERNAME);

      // Verify that now the 1st unassigned task is 2 and then 5
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #2");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #5");

      // Hide unassigned tasks section
      await toggleSectionUnassigned();

      // Verify the 2 tasks are on USERNAME's task list
      await expect(getTaskTitleElement(`${USERNAME}TasksList`, 0)).toHaveText("Acme - Task #1");
      await expect(getTaskTitleElement(`${USERNAME}TasksList`, 1)).toHaveText("Acme - Task #3");

      // Unassign all USERNAME's tasks
      await swipeLeftTask(`${USERNAME}TasksList`, 0);
      await swipeLeftTask(`${USERNAME}TasksList`, 1);
      await bulkUnassign();

      // Show unassigned tasks section
      await toggleSectionUnassigned();

      // Verify all tasks are unassigned
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
    }
  );

  itif(device.getPlatform() === 'android')(
    'should assing a task and an order to a courier and then unassign them',
    async () => {
      // All 4 tasks are unassigned
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 3)).toHaveText("Acme - Task #5");

      // Assign task 5 and order 1 (that has 3 tasks) from task 2
      await swipeRightTask(UNASSIGNED_TASKS_LIST_ID, 1);
      await swipeLeftTask(UNASSIGNED_TASKS_LIST_ID, 3);
      await bulkAssignToUser(USERNAME);

      // Verify that now the 1st unassigned task is 7
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #7");

      // Hide unassigned tasks section
      await toggleSectionUnassigned();

      // Verify all the 4 tasks are on USERNAME's task list
      await expect(getTaskTitleElement(`${USERNAME}TasksList`, 0)).toHaveText("Acme - Task #1");
      await expect(getTaskTitleElement(`${USERNAME}TasksList`, 1)).toHaveText("Acme - Task #2");
      await expect(getTaskTitleElement(`${USERNAME}TasksList`, 2)).toHaveText("Acme - Task #3");
      await expect(getTaskTitleElement(`${USERNAME}TasksList`, 3)).toHaveText("Acme - Task #5");

      // Unassign all USERNAME's tasks
      await swipeRightTask(`${USERNAME}TasksList`, 1); // Entire order from task 2
      await swipeLeftTask(`${USERNAME}TasksList`, 3); // Just task 5
      await bulkUnassign();

      // Show unassigned tasks section
      await toggleSectionUnassigned();

      // Verify all tasks are unassigned
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
      await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 3)).toHaveText("Acme - Task #5");
    }
  );
});
