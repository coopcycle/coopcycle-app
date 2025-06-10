import {
  selectAutocompleteAddress,
} from "../support/commands";
import {
  doLoginForUserWithRoleDispatcher,
  getTaskTitleElement,
  loadDispatchFixture,
  relaunchCleanApp,
} from './utils';
import { describeif, tapById } from '../utils';
import { UNASSIGNED_TASKS_LIST_ID } from '../../src/shared/src/constants';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Create delivery', () => {

  beforeEach(async () => {
    await relaunchCleanApp();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
  });

  it(`should create a delivery for a store`, async () => {
    await tapById('dispatchNewDelivery');

    // Select store
    await tapById('dispatch:storeList:0');

    // Pickup address

    // Select default store's address and continue
    await tapById('delivery__next_button');

    // Dropoff address
    await selectAutocompleteAddress('delivery__dropoff__address');

    // Append "\n" to make sure virtual keyboard is hidden after entry
    // https://github.com/wix/detox/issues/209
    await expect(element(by.id('delivery__dropoff__contact_name'))).toBeVisible();
    await element(by.id('delivery__dropoff__contact_name')).typeText('Alice\n');

    await expect(element(by.id('delivery__dropoff__phone'))).toBeVisible();
    await element(by.id('delivery__dropoff__phone')).typeText('0612345678\n');

    await tapById('delivery__next_button');

    // Delivery form

    // Select default values and continue
    await tapById('delivery__next_button');

    // Price form

    // Select default values and continue
    await tapById('delivery__next_button');

    // Check the new task was created
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 6)).toHaveText("Acme - Task #11");
  });

});
