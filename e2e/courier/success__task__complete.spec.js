import {
  authenticateWithCredentials,
  describeif,
  loadFixturesAndConnect,
  tapById,
  tapByText,
  waitToBeVisible,
} from '@/e2e/support/commands';
import { swipeRight, typeTextQuick } from '../support/commands';
import { tapTask } from './utils';

const USER_JANE = 'jane';

describeif(device.getPlatform() === 'android')('Courier - Task Page', () => {
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
    await tapTask(0);
  });

  it('should complete a task', async () => {
    // Tap Complete button
    await swipeRight('task:completeButton');
    await tapById('task:completeSuccessButton');
    await tapByText('✓ Complete');

    await typeTextQuick('notes-input', 'Some additional notes');

    await tapById('task:finishButton');

    // Verify task #2 has status "DONE"
    await waitToBeVisible('taskListItemIcon:DONE:2');
  });
});
