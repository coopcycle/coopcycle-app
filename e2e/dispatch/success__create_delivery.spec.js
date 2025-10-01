import {
  describeif,
  //selectAutocompleteAddress,
  tapById,
  //typeTextQuick,
  waitToBeVisible,
} from "../support/commands";
import {
  expectTaskTitleToHaveText,
  loadDispatchFixture,
  loginDispatcherUser,
} from './utils';
import { UNASSIGNED_TASKS_LIST_ID } from '../../src/shared/src/constants';

// NOTE: Although this test is ALMOST THE SAME as the one at `store/success__create_delivery.spec.js`,
// somehow it randomly fails when entering address or contact name or phone with an ugly "network timeout error".
// That's why we use those 2 functions below, just for this test...
const selectAutocompleteAddressJustForThisTest = async (
  elemId,
  address='91 rue de rivoli paris',
  placeId='Eh85MSBSdWUgZGUgUml2b2xpLCBQYXJpcywgRnJhbmNlIjASLgoUChIJmeuzXiFu5kcRwuW58Y4zYxgQWyoUChIJt4MohSFu5kcRUHvqO0vC-Ig'
) => {
  await waitToBeVisible(elemId);

  await typeTextQuickJustForThisTest(elemId, address);

  await element(by.id(`placeId:${placeId}`)).tap();
  return element(by.id(`placeId:${placeId}`));
};

// Nothing "quick" here.. just the regular `typeText`
const typeTextQuickJustForThisTest = async (elemId, text) => {
  console.log(`Typing text "${text}" into element with testID "${elemId}"..`);
  return await element(by.id(elemId)).typeText(text);
};

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Create delivery', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();
  });

  it('should create a delivery for a store', async () => {
    await tapById('dispatchNewDelivery');

    // Select store
    await tapById('dispatch:storeList:0');

    // Pickup address

    // Select default store's address and continue
    await tapById('delivery__next_button');

    // Dropoff address
    await selectAutocompleteAddressJustForThisTest('delivery__dropoff__address');

    // Append "\n" to make sure virtual keyboard is hidden after entry
    // https://github.com/wix/detox/issues/209
    await waitToBeVisible('delivery__dropoff__contact_name');
    await typeTextQuickJustForThisTest('delivery__dropoff__contact_name', 'Alice\n');

    await waitToBeVisible('delivery__dropoff__phone');
    await typeTextQuickJustForThisTest('delivery__dropoff__phone', '0612345678\n');

    await tapById('delivery__next_button');

    // Delivery form

    // Select default values and continue
    await tapById('delivery__next_button');

    // Price form

    // Select default values and continue
    await tapById('delivery__next_button');

    // Check the new task was created
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 6, "Acme (task #11)");
  });

});
