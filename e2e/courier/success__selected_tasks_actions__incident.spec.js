import {
  authenticateWithCredentials,
  describeif,
  loadFixturesAndConnect,
  longPressById,
  swipeDown,
  tapById,
  tapByText,
  waitToBeVisible,
} from '@/e2e/support/commands';
import { typeTextQuick } from '../support/commands';

const USER_JANE = 'jane';

describeif(device.getPlatform() === 'android')(
  'Courier - Select and tap an action for selected tasks',
  () => {
    beforeEach(async () => {
      await loadFixturesAndConnect('courier.yml', true);
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

      // Long press assigned task #2
      await longPressById(`courierTaskList:task:0`);

      // Press the 3-dot menu button
      await tapById('selectedTasksToEditMenuButton');
    });

    it('should mark a task as INCIDENT ', async () => {
      // Tap Report incident button
      await tapById('ReportIncidenceButton');

      // To open select
      await tapById('failure-reason-select-trigger');

      // To select any option
      await tapById('failure-reason-option-1');

      // Fills description input
      await typeTextQuick(
        'ReportTextareaInput',
        'Some text to describe any incident',
      );

      await waitToBeVisible('task:finishButton');
      await tapById('task:finishButton');

      // Verify task #2 has status "INCIDENT"
      await waitToBeVisible('taskListItemIcon:INCIDENT:2');
    });
  },
);
