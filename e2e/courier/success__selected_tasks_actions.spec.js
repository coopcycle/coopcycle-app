import {
  authenticateWithCredentials,
  describeif,
  expectToNotExist,
  loadFixturesAndConnect,
  longPressById,
  tapById,
  tapByText,
  waitToBeVisible
} from "../support/commands";
import {
  assignOrderToUser,
  loadDispatchFixture,
  loginDispatcherUser,
  toggleSectionUnassigned,
} from '../dispatch/utils';

const USER_JANE = 'jane';

describeif(device.getPlatform() === 'android')
  ('Courier - Select and tap an action for selected tasks', () => {

  beforeEach(async () => {

    
    await loadFixturesAndConnect('courier.yml');
    await authenticateWithCredentials('jane', '12345678');

    // Assign task #1
    await assignOrderToUser(USER_JANE);

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
    await waitToBeVisible('task:finishButton');
    await tapByText('Validate');

    // Verify task #1 has status "DONE"
    await waitToBeVisible('taskListItemIcon:DONE:1');
  });

  it('should mark a task as CANCELLED', async () => {
    // Tap Cancel button
    await tapById('CancelTaskButton');

    // Waits to see if it was removed
    await expectToNotExist(`${USER_JANE}TasksList:task:0`);
  });
  
  it('should mark a task as INCIDENT REPORTED ', async () => {
    // Tap Report incident button
    await tapById('ReportIncidenceButton');

    await waitToBeVisible('task:finishButton');
    await tapByText('Report incident');

    // Verify task #1 has status "FAILED"
    await waitToBeVisible('taskListItemIcon:FAILED:1');
  });
});
