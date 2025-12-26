import {
  describeif,
  selectAutocompleteAddress,
  tapById,
  typeTextQuick,
  waitToBeVisible,
} from "../support/commands";
import {
  expectTaskTitleToHaveText,
  loadDispatchFixture,
  loginDispatcherUser,
  toggleSectionUnassigned,
} from './utils';
import { UNASSIGNED_TASKS_LIST_ID } from '../../src/shared/src/constants';

const CONTACT_NAME = 'Alice';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Create delivery', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();
  });

  it('should create a delivery for a store', async () => {
    // Show unassigned tasks section
    await toggleSectionUnassigned();

    await tapById('dispatchNewDelivery');

    // Select store
    await tapById('dispatch:storeList:0');

    // Pickup address

    // Select default store's address and continue
    await tapById('delivery__next_button');

    // Dropoff address
    await selectAutocompleteAddress('address-input');

    // Append "\n" to make sure virtual keyboard is hidden after entry
    // https://github.com/wix/detox/issues/209
    await waitToBeVisible('address-contact-name-input');
    await typeTextQuick('address-contact-name-input', `${CONTACT_NAME}\n`);

    await waitToBeVisible('address-telephone-input');

    //TODO: for some reason typeTextQuick behaves strange on CI here,
    // while it works fine in e2e/store/success__create_delivery.spec.js
    // await typeTextQuick('address-telephone-input', '0612345678\n');
    await element(by.id('address-telephone-input')).typeText('0612345678\n');

    await tapById('delivery__next_button');

    // Delivery form

    // Select default values and continue
    await tapById('delivery__next_button');

    // Price form

    // Select default values and continue
    await tapById('delivery__next_button');

    // Search by contact name
    await typeTextQuick('searchTextInput', `${CONTACT_NAME}\n`);
    await waitToBeVisible('dispatchTasksSearchResults', 10000);

    // Check the new tasks were created
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 0, "Acme (task #12)");
  });

});
