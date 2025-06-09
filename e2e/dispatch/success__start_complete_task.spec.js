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
import {
  describeif,
  swipeLeft,
  swipeRight,
  tapById,
  tapByText,
} from "../utils";

const USER_JANE = 'jane';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Start and complete a task', () => {

  beforeEach(async () => {
    await relaunchCleanApp();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();

    // Assign task #1
    await assignTaskToUser(USER_JANE);

    // Hide unassigned tasks section
    await toggleSectionUnassigned();

    // Open assigned task #1
    await tapById(`${USER_JANE}TasksList:task:0`);
  });

  it('should mark a task as DOING', async () => {
    // Swipe complete button, tap 'ok' and press 'Start'
    await swipeRight('task:completeButton');
    await tapById('task:completeSuccessButton');
    await tapByText('▶ Start');

    // Go back to AllTasks view
    await device.pressBack();

    // Verify task #1 has status "DOING"
    await expect(element(by.id('taskListItemIcon:DOING:1'))).toBeVisible();
  });


  it('should mark a task as DONE', async () => {
    // Swipe complete button, tap 'ok' and press 'Complete'
    await swipeRight('task:completeButton');
    await tapById('task:completeSuccessButton');
    await tapByText('✓ Complete');

    // Click the finish button in the new view
    await tapById('task:finishButton');

    // Verify task #1 has status "DONE"
    await expect(element(by.id('taskListItemIcon:DONE:1'))).toBeVisible();
  });

  // TODO FIXME: Somehow the step to tap 'task:finishButton' isn't working..!
  // The view is loaded fine but the console keeps saying:
  //     The app is busy with the following tasks:
  //       • UI elements are busy:
  //         - Reason: Animations running on screen.
  // it('should mark a task as FAILED', async () => {
  //   // Swipe complete button, tap 'failed' and press 'Start'
  //   await swipeLeft('task:completeButton');
  //   await tapById('task:completeFailureButton');

  //   // Click the finish button in the new view
  //   await tapById('task:finishButton');

  //   // Verify task #1 has status "FAILED"
  //   await expect(element(by.id('taskListItemIcon:FAILED:1'))).toBeVisible();
  // });

});
