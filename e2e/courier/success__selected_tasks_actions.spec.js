import {
  authenticateWithCredentials,
  describeif,
  loadFixturesAndConnect,
  longPressById,
  swipeDown,
  tapById,
  tapByText,
  waitToBeVisible,
} from "../support/commands";

const USER_JANE = 'jane';

describeif(device.getPlatform() === 'android')
  ('Courier - Select and tap an action for selected tasks', () => {

  beforeEach(async () => {
    await loadFixturesAndConnect('courier.yml');
    await authenticateWithCredentials(USER_JANE, '12345678');

    try {
      // dismiss BACKGROUND_PERMISSION_DISCLOSURE alert
      await tapByText('I accept');
    } catch {}

    try {
      // dismiss HMS Core alert
      await tapByText('OK');
    } catch {}

    await waitToBeVisible('messengerTabMap');
    await waitToBeVisible('messengerTabList');

    await tapById('messengerTabList');

    // long press assigned task #1
    await longPressById(`courierTaskList:task:0`);

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

    // Waits to see if it's removed
    // Should it be this way? Are we expecting TLItem to be removed?
    //await expectToNotExist(`courierTasksList:task:0`);
  });
  
  it('should mark a task as INCIDENT REPORTED ', async () => {
    // Tap Report incident button
    await tapById('ReportIncidenceButton');

    await waitToBeVisible('task:finishButton');
    await tapByText('Report incident');

    await swipeDown('courierTaskList');

    // Verify task #1 has status "FAILED"
    //await waitToBeVisible('taskListItemIcon:INCIDENT:1');
  });
});
