import {
  authenticateWithCredentials,
  describeif,
  loadFixturesAndConnect,
  tapById,
  tapByText,
  waitToBeVisible,
} from '@/e2e/support/commands';
import {
  scrollToElement,
  selectAutocompleteAddress,
  typeTextQuick,
} from '../support/commands';
import { swipeLeftTaskAndTap } from './utils';

const USER_JANE = 'jane';

//FIXME: Re-enable this test after https://github.com/coopcycle/coopcycle-web/pull/5153 is merged
//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'none')('Courier - Task List', () => {
  // describeif(device.getPlatform() === 'android')('Courier - Task List', () => {
  beforeEach(async () => {
    await loadFixturesAndConnect([
      'setup_default.yml',
      'user_dispatcher.yml',
      'store_advanced.yml',
      'package_delivery_order_assigned.yml',
    ]);
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
  });

  it('should report an incident with suggested changes', async () => {
    // Tap Report incident button
    await swipeLeftTaskAndTap(1);

    // To open select
    await tapById('failure-reason-select-trigger');

    // To select any option
    await tapById('failure-reason-option-1');

    // Fills description input
    await typeTextQuick('notes-input', 'Some text to describe any incident');

    // Tap Edit Tab
    await tapById('editTabButton');

    //TODO: add some suggestion

    await selectAutocompleteAddress('address-input');

    await typeTextQuick('address-business-name-input', 'Acme\n');
    await typeTextQuick('address-contact-name-input', 'Alice\n');
    await typeTextQuick('address-telephone-input', '0612345678\n');
    await typeTextQuick('address-description-input', 'Second floor\n');

    // Scroll to submit button
    await scrollToElement('scrollView:edit', 'task:finishButton-edit');

    // Tap Submit Button
    await tapById('task:finishButton-edit');

    // Verify dropoff task has status "INCIDENT"
    await waitToBeVisible('taskListItemIcon:INCIDENT:1');
  });
});
