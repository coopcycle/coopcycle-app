import {
  describeif,
  expectToNotExist,
  longPressById,
  tapById,
  waitToBeVisible,
} from '@/e2e/support/commands';
import {
  assignOrderToUser,
  expectTaskTitleToHaveText,
  loadDispatchFixture,
  loginDispatcherUser,
  toggleSectionUnassigned,
  toggleSectionUser,
} from '@/e2e/dispatch/utils';

const USER_JANE = 'jane';
const USER_ZAK = 'zak';

describeif(device.getPlatform() === 'android')
  ('Dispatch - Reorder tasks using sort buttons', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();

    // Assign order with multiple tasks to Jane
    await assignOrderToUser(USER_JANE);

    // Show USER_JANE's tasks section
    await toggleSectionUser(USER_JANE);

    // Verify initial tasks are loaded
    await waitToBeVisible(`${USER_JANE}TasksList:task:0`);
    await waitToBeVisible(`${USER_JANE}TasksList:task:1`);
    await waitToBeVisible(`${USER_JANE}TasksList:task:2`);
  });

  it('should reorder task to beginning of list', async () => {
    // Long press on task #3 to select it for reordering
    await longPressById(`${USER_JANE}TasksList:task:2`);

    // Tap sort button before first task
    await tapById(`${USER_JANE}TasksList:task:0:sort:previous`);

    // Verify the order has changed - task #3 should now be first
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #3)");
  });

  it('should reorder task between other tasks', async () => {
    // Long press on task #1 to select it for reordering
    await longPressById(`${USER_JANE}TasksList:task:0`);
    
    // Tap sort button after task #1 (this should insert task #1 after task #2)    
    await tapById(`${USER_JANE}TasksList:task:1:sort`);
    
    // Verify the order has changed - task #1 should now be at position 1
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #1)");
  });

  it('should not show sort buttons when multiple tasks are selected', async () => {
    // Select multiple tasks (this should hide sort buttons)
    await longPressById(`${USER_JANE}TasksList:task:0`);
    await longPressById(`${USER_JANE}TasksList:task:1`);

    // Verify sort buttons are not visible for any task
    await expectToNotExist(`${USER_JANE}TasksList:task:0:sort`);
    await expectToNotExist(`${USER_JANE}TasksList:task:1:sort`);
    await expectToNotExist(`${USER_JANE}TasksList:task:2:sort`);
  });

  it('should not show sort buttons for tasks assigned to different couriers', async () => {
    // Select a task from Jane's list
    await longPressById(`${USER_JANE}TasksList:task:0`);

    // Sort buttons should only be visible for Jane's tasks
    await waitToBeVisible(`${USER_JANE}TasksList:task:1:sort`);

    // Select another task from unassigned tasks (different courier)
    await toggleSectionUnassigned();
    // Assign an order to Zak
    await assignOrderToUser(USER_ZAK, 0);
    // Show USER_ZAK's tasks section
   
    await toggleSectionUnassigned();
    // Collapse Jane's section to make it easier to see Zak's section
    await toggleSectionUser(USER_JANE);

    // Select a task from Zak's list
    await longPressById(`${USER_ZAK}TasksList:task:0`);

    // Verify sort buttons are not visible for Zak's task or Jane's tasks.
    await expectToNotExist(`${USER_JANE}:task:1:sort`);
    await expectToNotExist(`${USER_ZAK}:task:1:sort`);
  });

  it('should clear selection after reordering', async () => {
    // Select a task for reordering
    await longPressById(`${USER_JANE}TasksList:task:0`);

    // Perform reorder
    await tapById(`${USER_JANE}TasksList:task:1:sort`);

    // Verify selection was cleared (Menu button should not be visible or Sort button should not be visible)
    await expectToNotExist('selectedTasksToEditMenuButton');
  });
});