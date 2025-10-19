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

    // Show unassigned tasks section
    await toggleSectionUnassigned();

    // Assign the 1st order in the list with tasks #1+#2+#3
    await assignOrderToUser(USER_JANE);

    // Hide unassigned tasks section
    await toggleSectionUnassigned();
    // Show USER_JANE's tasks section
    await toggleSectionUser(USER_JANE);

    // Verify tasks #1+#2+#3 are on USER_JANE's task list
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #1)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #2)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 2, "Acme (task #3)");
  });

  it('should reorder task in all the different situations', async () => {

    console.log("//////////////////// REORDER TASK :: 1st to 2nd ////////////////////");

    // Long press on task #1 to select it for reordering
    await longPressById(`${USER_JANE}TasksList:task:0`);

    // Tap sort button after second task
    await tapById(`${USER_JANE}TasksList:task:1:sort`);

    // Verify the order has changed - task #1 should be at position 2
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #2)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #1)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 2, "Acme (task #3)");

    console.log("//////////////////// REORDER TASK :: 1st to 3rd ////////////////////");

    // Long press on task #2 to select it for reordering
    await longPressById(`${USER_JANE}TasksList:task:0`);

    // Tap sort button after third task
    await tapById(`${USER_JANE}TasksList:task:2:sort`);

    // Verify the order has changed - task #2 should be at position 3
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #1)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #3)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 2, "Acme (task #2)");

    console.log("//////////////////// REORDER TASK :: 2nd to 1st ////////////////////");

    // Long press on task #3 to select it for reordering
    await longPressById(`${USER_JANE}TasksList:task:1`);

    // Tap sort button before first task
    await tapById(`${USER_JANE}TasksList:task:0:sort:previous`);

    // Verify the order has changed - task #2 should be at position 3
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #3)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #1)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 2, "Acme (task #2)");

    console.log("//////////////////// REORDER TASK :: 2nd to 3rd ////////////////////");

    // Long press on task #1 to select it for reordering
    await longPressById(`${USER_JANE}TasksList:task:1`);

    // Tap sort button after third task
    await tapById(`${USER_JANE}TasksList:task:2:sort`);

    // Verify the order has changed - task #2 should be at position 3
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #3)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #2)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 2, "Acme (task #1)");

    console.log("//////////////////// REORDER TASK :: 3rd to 1st ////////////////////");

    // Long press on task #1 to select it for reordering
    await longPressById(`${USER_JANE}TasksList:task:2`);

    // Tap sort button before first task
    await tapById(`${USER_JANE}TasksList:task:0:sort:previous`);

    // Verify the order has changed - task #1 should be at position 1
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #1)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #3)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 2, "Acme (task #2)");

    console.log("//////////////////// REORDER TASK :: 3rd to 2nd ////////////////////");

    // Long press on task #2 to select it for reordering
    await longPressById(`${USER_JANE}TasksList:task:2`);

    // Tap sort button after first task
    await tapById(`${USER_JANE}TasksList:task:0:sort`);

    // Verify the order has changed - task #2 should be at position 2
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #1)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #2)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 2, "Acme (task #3)");

    console.log("//////////////////// should NOT show sort buttons checks ////////////////////");

    // Select multiple tasks (this should hide sort buttons)
    await longPressById(`${USER_JANE}TasksList:task:0`);
    await longPressById(`${USER_JANE}TasksList:task:1`);

    // Verify sort buttons are not visible for any task
    await expectToNotExist(`${USER_JANE}TasksList:task:0:sort:previous`);
    await expectToNotExist(`${USER_JANE}TasksList:task:0:sort`);
    await expectToNotExist(`${USER_JANE}TasksList:task:1:sort`);
    await expectToNotExist(`${USER_JANE}TasksList:task:2:sort`);

    // DE-select a task from Jane's list
    await longPressById(`${USER_JANE}TasksList:task:1`);
    // Verify sort buttons are now visible again for Jane's tasks
    await waitToBeVisible(`${USER_JANE}TasksList:task:1:sort`);

    // Select another task from unassigned tasks (different courier)

    // Show unassigned tasks section
    await toggleSectionUnassigned();
    // Assign an order to Zak
    await assignOrderToUser(USER_ZAK, 0);
    // Hide unassigned tasks section
    await toggleSectionUnassigned();
    // Show USER_ZAK's tasks section
    await toggleSectionUser(USER_ZAK);

    // Select a task from Zak's list
    await longPressById(`${USER_ZAK}TasksList:task:0`);

    // Verify sort buttons are not visible for Zak's task or Jane's tasks.
    await expectToNotExist(`${USER_JANE}TasksList::task:1:sort`);
    await expectToNotExist(`${USER_ZAK}TasksList::task:1:sort`);

    // DE-select a task from Zak's list
    await longPressById(`${USER_ZAK}TasksList:task:0`);

    // Verify sort buttons are now visible again for Jane's tasks
    await waitToBeVisible(`${USER_JANE}TasksList:task:1:sort`);
    await waitToBeVisible('selectedTasksToEditMenuButton');

    // Perform reorder
    await tapById(`${USER_JANE}TasksList:task:1:sort`);

    // Verify selection was cleared (Menu button should not be visible or Sort button should not be visible)
    await expectToNotExist('selectedTasksToEditMenuButton');
    await expectToNotExist(`${USER_JANE}TasksList:task:1:sort`);
  });
});
