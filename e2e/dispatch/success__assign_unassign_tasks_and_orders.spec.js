import {
  describeif,
} from "../support/commands";
import {
  assignOrderToUser,
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
  toggleSectionUser,
  unassignOrderFromUser,
  unassignTaskFromUser,
} from './utils';
import { UNASSIGNED_TASKS_LIST_ID } from '../../src/shared/src/constants';

const USER_JANE = 'jane';
const USER_ZAK = 'zak';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Assing, reassign and unassign tasks and orders (single + bulk)', () => {

  beforeEach(async () => {
    await relaunchCleanApp();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
  });

  it('should assing a single task to a courier and then unassign it', async () => {
    // All 3 tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");

    // Assign task #2
    await assignTaskToUser(USER_JANE, 1);

    // Verify task #1 and #3 were not assigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #3");

    // Hide unassigned tasks section
    await toggleSectionUnassigned();

    // Verify task #2 is on USER_JANE's task list
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`)).toHaveText("Acme - Task #2");

    // Unassign the task
    await unassignTaskFromUser(USER_JANE);

    // Show unassigned tasks section
    await toggleSectionUnassigned();

    // Verify all tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
  });

  it('should assing a single order (with 3 tasks) to a courier and then unassign it', async () => {
    // All 4 tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 3)).toHaveText("Acme - Task #5");

    // Assign order #1 (that has 3 tasks) from task #2
    await assignOrderToUser(USER_JANE, 1);

    // Verify that now the 1st unassigned task is #5
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #5");

    // Hide unassigned tasks section
    await toggleSectionUnassigned();

    // Verify all the 3 tasks are on USER_JANE's task list
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 2)).toHaveText("Acme - Task #3");

    // Unassign USER_JANE's order (from task #3)
    await unassignOrderFromUser(USER_JANE, 2);

    // Show unassigned tasks section
    await toggleSectionUnassigned();

    // Verify all tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 3)).toHaveText("Acme - Task #5");
  });

  it('should bulk assign two tasks to a courier and then unassign them', async () => {
    // All 3 tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");

    // Assign task #1 and #3
    await swipeLeftTask(UNASSIGNED_TASKS_LIST_ID, 0);
    await swipeLeftTask(UNASSIGNED_TASKS_LIST_ID, 2);
    await bulkAssignToUser(USER_JANE);

    // Verify that now the 1st unassigned task is #2 and then #5
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #5");

    // Hide unassigned tasks section
    await toggleSectionUnassigned();

    // Verify the 2 tasks are on USER_JANE's task list
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 1)).toHaveText("Acme - Task #3");

    // Unassign all USER_JANE's tasks
    await swipeLeftTask(`${USER_JANE}TasksList`, 0);
    await swipeLeftTask(`${USER_JANE}TasksList`, 1);
    await bulkUnassign();

    // Show unassigned tasks section
    await toggleSectionUnassigned();

    // Verify all tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
  });

  it('should bulk assing a task and an order to a courier and then unassign them', async () => {
    // All 4 tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 3)).toHaveText("Acme - Task #5");

    // Assign task #5 and order #1 (that has 3 tasks) from task #2
    await swipeRightTask(UNASSIGNED_TASKS_LIST_ID, 1);
    await swipeLeftTask(UNASSIGNED_TASKS_LIST_ID, 3);
    await bulkAssignToUser(USER_JANE);

    // Verify that now the 1st unassigned task is #7
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #7");

    // Hide unassigned tasks section
    await toggleSectionUnassigned();

    // Verify all the 4 tasks are on USER_JANE's task list
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 2)).toHaveText("Acme - Task #3");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 3)).toHaveText("Acme - Task #5");

    // Unassign all USER_JANE's tasks
    await swipeRightTask(`${USER_JANE}TasksList`, 1); // Entire order from task #2
    await swipeLeftTask(`${USER_JANE}TasksList`, 3); // Just task #5
    await bulkUnassign();

    // Show unassigned tasks section
    await toggleSectionUnassigned();

    // Verify all tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 3)).toHaveText("Acme - Task #5");
  });

  it('should bulk assing a task and an order to a courier and then reassign them to another courier and then unassign them all again', async () => {
    // All 5 tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 3)).toHaveText("Acme - Task #5");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 4)).toHaveText("Acme - Task #7");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 5)).toHaveText("Acme - Task #9");

    // Assign task #5 and order #1 (that has 3 tasks) from task #1
    await swipeRightTask(UNASSIGNED_TASKS_LIST_ID, 0);
    await swipeLeftTask(UNASSIGNED_TASKS_LIST_ID, 3);
    await bulkAssignToUser(USER_JANE);

    // Verify that now the 1st unassigned task is #7 and then #9
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #7");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #9");

    // Select order #3 (that has 2 tasks) from task #7
    await swipeRightTask(UNASSIGNED_TASKS_LIST_ID, 0);

    // Hide unassigned tasks section
    await toggleSectionUnassigned();

    // Verify all the 4 tasks are on USER_JANE's task list
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 2)).toHaveText("Acme - Task #3");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 3)).toHaveText("Acme - Task #5");

    // Reassign order #3 (from unassigned), order #2 and task #3
    await swipeLeftTask(`${USER_JANE}TasksList`, 2); // Just task #3 from order #1
    await swipeRightTask(`${USER_JANE}TasksList`, 3); // Entire order #2 from task #5
    await bulkAssignToUser(USER_ZAK);

    // Verify that just 2 tasks are left on USER_JANE's task list
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 1)).toHaveText("Acme - Task #2");

    // Select the entire order #1 from task #2 from USER_JANE
    await swipeRightTask(`${USER_JANE}TasksList`, 1);

    // Hide USER_JANE's tasks section
    await toggleSectionUser(USER_JANE);

    // Verify all the 5 tasks are on USER_ZAK's task list
    await expect(getTaskTitleElement(`${USER_ZAK}TasksList`, 0)).toHaveText("Acme - Task #7");
    await expect(getTaskTitleElement(`${USER_ZAK}TasksList`, 1)).toHaveText("Acme - Task #6");
    await expect(getTaskTitleElement(`${USER_ZAK}TasksList`, 2)).toHaveText("Acme - Task #4");
    await expect(getTaskTitleElement(`${USER_ZAK}TasksList`, 3)).toHaveText("Acme - Task #5");
    await expect(getTaskTitleElement(`${USER_ZAK}TasksList`, 4)).toHaveText("Acme - Task #3");

    // Select order #2, and task #6 from USER_ZAK
    await swipeRightTask(`${USER_ZAK}TasksList`, 0); // Entire order #3 from task #7
    await swipeLeftTask(`${USER_ZAK}TasksList`, 1); // Just task #6 (the order above already includes this one)
    await swipeRightTask(`${USER_ZAK}TasksList`, 3); // Entire order #2 from task #5

    // Unassign all selected tasks/orders
    await bulkUnassign();

    // Show unassigned tasks section
    await toggleSectionUnassigned();

    // Verify all tasks are unassigned
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 2)).toHaveText("Acme - Task #3");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 3)).toHaveText("Acme - Task #5");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 4)).toHaveText("Acme - Task #7");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 5)).toHaveText("Acme - Task #9");
  });

});
