import {
  describeif,
  expectToNotExist,
  longPressById,
  tapById,
  tapByText,
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

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Select and tap an action for selected tasks', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();

    // Show unassigned tasks section
    await toggleSectionUnassigned();

    // Assign order #1 (that has 3 tasks)
    await assignOrderToUser(USER_JANE);

    // Hide unassigned tasks section
    await toggleSectionUnassigned();
    // Show USER_JANE's tasks section
    await toggleSectionUser(USER_JANE);

    // Long press assigned task #1
    await longPressById(`${USER_JANE}TasksList:task:0`);

    // Press the 3-dot menu button
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
    await waitToBeVisible('task:finishButton');
    await tapByText('Validate');

    // Verify task #1 has status "DONE"
    await waitToBeVisible('taskListItemIcon:DONE:1');
  });

  it('should mark a task as CANCELLED', async () => {
    // Tap Cancel button
    await tapById('CancelTaskButton');
    await tapByText('Proceed');
    // Verify task #1 has the "CANCELLED" background
    await waitToBeVisible(`${USER_JANE}TasksList:task:0:cancelledBg`);
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #1)");

    // Open the filters screen and enable "Hide unassigned tasks from map"
    await tapById('showTasksFiltersButton');
    await waitToBeVisible('dispatchTasksFiltersView');
    await tapById('hideCancelledTasksSwitch');
    // Go back
    await device.pressBack();

    // Verify task #1 has gone from the list
    await expectToNotExist(`${USER_JANE}TasksList:task:0:cancelledBg`);
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #2)");
  });

  it('should mark a task as INCIDENT', async () => {
    // Tap Report incident button
    await tapById('ReportIncidenceButton');

    await waitToBeVisible('task:finishButton');
    await tapByText('Report incident');

    // Verify task #1 has status "INCIDENT"
    await waitToBeVisible('taskListItemIcon:INCIDENT:1');
  });
});
