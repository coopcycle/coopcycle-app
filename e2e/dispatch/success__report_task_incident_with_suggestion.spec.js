import {
  describeif,
  longPressById,
  scrollToElement,
  tapById,
  waitToBeVisible,
} from '@/e2e/support/commands';
import {
  assignOrderToUser,
  loadDispatchFixture,
  loginDispatcherUser,
  toggleSectionUnassigned,
  toggleSectionUser,
} from '@/e2e/dispatch/utils';
import { swipeDown } from '../support/commands';

const USER_JANE = 'jane';

//FIXME: Re-enable this test after https://github.com/coopcycle/coopcycle-web/pull/5153 is merged
//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'none')(
  // describeif(device.getPlatform() === 'android')(
  'Dispatch - Select and report an incident for selected task',
  () => {
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

      // Tap Report incident button
      await tapById('ReportIncidenceButton');
    });

    it('should report an incident with suggested changes', async () => {
      // Tap Edit Tab
      await tapById('editTabButton');

      //TODO: add some suggestion

      // Scroll to submit button
      await scrollToElement('scrollView:edit', 'task:finishButton-edit');

      // Tap Submit Button
      await tapById('task:finishButton-edit');

      // TODO FIX: FORCE TASK LIST UPDATE because somehow it fails to auto-refresh..!
      await swipeDown('dispatchTaskLists');

      // Verify task #1 has status "INCIDENT"
      await waitToBeVisible('taskListItemIcon:INCIDENT:1');
    });
  },
);
