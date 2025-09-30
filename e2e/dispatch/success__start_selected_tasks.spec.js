import {
  describeif,
  longPressById,
  swipeLeft,
  swipeRight,
  tapById,
  tapByText,
  waitToBeVisible
} from "../support/commands";
import {
  assignTaskToUser,
  loadDispatchFixture,
  loginDispatcherUser,
  toggleSectionUnassigned,
} from './utils';

const USER_JANE = 'jane';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Select and start a task', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();

    // Assign task #1
    await assignTaskToUser(USER_JANE);

    // Hide unassigned tasks section
    await toggleSectionUnassigned();

    // long press assigned task #1
    await longPressById(`${USER_JANE}TasksList:task:0`);

    await tapById('selectedTasksToEditMenuButton');
  });

  it('should mark a task as DOING', async () => {
    // Tap Start button in menu
    await tapById('StartTaskButton');
    // Verify task #1 has status "DOING"
    await waitToBeVisible('taskListItemIcon:DOING:1');
  });


  it('should mark a task as DONE', async () => {
    // Tap Complete button, tap 'Validate'
    await tapById('CompleteTaskButton');
    //await waitToBeVisible('task:finishButton');
    //await tapByText('Validate');

    // Verify task #1 has status "DONE"
    await waitToBeVisible('taskListItemIcon:DONE:1');
  });

//   // UGLY WORKAROUND: Disable synchronization for this test and use `waitToBeVisible`
//   it('should mark a task as FAILED', async () => {
//     // Ugly workaround: disable synchronization..
//     await device.disableSynchronization();

//     // Swipe complete button, tap 'failed' and press 'Report incident'
//     await swipeLeft('task:completeButton');
//     await waitToBeVisible('task:completeFailureButton'); // Remove if `disableSynchronization` is removed..!
//     await tapById('task:completeFailureButton');

//     // Click the finish button in the new view
//     await waitToBeVisible('task:finishButton'); // Remove if `disableSynchronization` is removed..!
//     await tapById('task:finishButton');

//     // Verify task #1 has status "FAILED"
//     // TODO FIXME: This check was disabled because the task isn't auto-refreshed!
//     // It seems that the backend doesn't send the update event.
//     //await waitToBeVisible('taskListItemIcon:FAILED:1');
//   });

});
