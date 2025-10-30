import {
  describeif,
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
  toggleSectionUser,
} from './utils';

const USER_JANE = 'jane';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Start and complete a task', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();

    // Show unassigned tasks section
    await toggleSectionUnassigned();

    // Assign task #1
    await assignTaskToUser(USER_JANE);

    // Hide unassigned tasks section
    await toggleSectionUnassigned();
    // Show USER_JANE's tasks section
    await toggleSectionUser(USER_JANE);

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
    await waitToBeVisible('taskListItemIcon:DOING:1');
  });

  it('should mark a task as DONE', async () => {
    // Swipe complete button, tap 'ok' and press 'Complete'
    await swipeRight('task:completeButton');
    await tapById('task:completeSuccessButton');
    await tapByText('✓ Complete');

    // Click the finish button in the new view
    await tapById('task:finishButton');

    // Verify task #1 has status "DONE"
    await waitToBeVisible('taskListItemIcon:DONE:1');
  });

  it('should mark a task as INCIDENT', async () => {
    // Swipe complete button, tap 'failed' and press 'Report incident'
    await swipeLeft('task:completeButton');
    await tapById('task:completeFailureButton');

    // Click the finish button in the new view
    await tapById('task:finishButton');

    // Verify task #1 has the "INCIDENT" icon
    await waitToBeVisible('taskListItemIcon:INCIDENT:1');
  });

});
