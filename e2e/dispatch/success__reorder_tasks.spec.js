import {
  describeif,
  expectToExist,
  getElementById,
  longPressById,
  tapById,
  waitToBeVisible,
} from '@/e2e/support/commands';
import {
  assignOrderToUser,
  loadDispatchFixture,
  loginDispatcherUser,
  toggleSectionUser,
} from '@/e2e/dispatch/utils';

const USER_JANE = 'jane';

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

  // it('should reorder task to beginning of list', async () => {
  //   // Long press on task #2 to select it for reordering
  //   await longPressById(`${USER_JANE}TasksList:task:2`);

  //   // Tap sort button before first task (index 0)
  //   await tapById(`${USER_JANE}TasksList:sort:0`);

  //   // Verify the order has changed - task #2 should now be first
  //   // We check by verifying the original task #0 is now at position 1
  //   await waitToBeVisible(`${USER_JANE}TasksList:task:0`);    
  // });

  it('should reorder task between other tasks', async () => {
    // Long press on task #0 to select it for reordering
    await longPressById(`${USER_JANE}TasksList:task:0`);

    // Verify task is selected
    await waitToBeVisible('taskListItemIcon:selected:0');
    
    //`${taskListId}${appendTaskListTestID}:task:${index}:sort:${index}`;
    // Tap sort button after task #1 (this should insert task #1 after task #2)
    await tapById(`${USER_JANE}TasksList:task:1:sort:1`);
    
    console.log(await device.getUIHierarchy());
  });

//   it('should not show sort buttons when multiple tasks are selected', async () => {
//     // Select multiple tasks (this should hide sort buttons)
//     await longPressById(`${USER_JANE}TasksList:task:0`);
//     await longPressById(`${USER_JANE}TasksList:task:1`);

//     // Verify sort buttons are not visible for any task
//     await expectToNotExist(`${USER_JANE}TasksList:task:0:sort:0`);
//     await expectToNotExist(`${USER_JANE}TasksList:task:1:sort:1`);
//     await expectToNotExist(`${USER_JANE}TasksList:task:2:sort:2`);
//   });

//   it('should not show sort buttons for tasks assigned to different couriers', async () => {
//     // This test would require setting up a scenario with multiple couriers
//     // For now, we can verify that sort buttons only appear for tasks with same assignee
    
//     // Select a task from Jane's list
//     await longPressById(`${USER_JANE}TasksList:task:0`);

//     // Sort buttons should only be visible for Jane's tasks
//     await waitToBeVisible(`${USER_JANE}TasksList:task:0:sort:0`);
//     await waitToBeVisible(`${USER_JANE}TasksList:task:1:sort:1`);

//     // If we had another user's tasks section, we would verify no sort buttons there
//     // await expectToNotExist(`otherUserTasksList:task:0:sort:0`);
//   });

//   it('should clear selection after reordering', async () => {
//     // Select a task for reordering
//     await longPressById(`${USER_JANE}TasksList:task:1`);

//     // Verify selection
//     await waitToBeVisible('taskListItemIcon:selected:1');

//     // Perform reorder
//     await tapById(`${USER_JANE}TasksList:task:0:sort:0`);

//     // Wait for reorder and verify selection is cleared
//     await waitFor(() => expectToNotExist('taskListItemIcon:selected:1')).toExist();

//     // Verify we can select another task (proving selection was cleared)
//     await longPressById(`${USER_JANE}TasksList:task:2`);
//     await waitToBeVisible('taskListItemIcon:selected:2');
//   });
});