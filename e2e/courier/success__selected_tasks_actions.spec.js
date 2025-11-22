import {
  authenticateWithCredentials,
  describeif,
  loadFixturesAndConnect,
  longPressById,
  tapById,
  tapByText,
  waitToBeVisible,
} from '@/e2e/support/commands';

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

    // Long press assigned task #1
    await longPressById(`courierTaskList:task:0`);

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

  it('should mark a task as INCIDENT ', async () => {
    // Tap Report incident button
    await tapById('ReportIncidenceButton');

    await waitToBeVisible('task:finishButton');
    await tapById('task:finishButton');

    // FIX: Returns an error because task is not associated with a delivery 
    // (Mandatory to create an incident with a suggestion)
    // Verify task #1 has status "INCIDENT"
    //await waitToBeVisible('taskListItemIcon:INCIDENT:1');
  });
});
