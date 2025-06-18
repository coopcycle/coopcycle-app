import {
  describeif,
  selectAutocompleteAddress,
  tapById,
  typeTextQuick,
  waitToBeVisible,
} from "../support/commands";
import {
  loadStoreFixture,
  loginStoreUser,
} from './utils';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Store - Create delivery', () => {

  beforeEach(async () => {
    await loadStoreFixture();
    await loginStoreUser();
  });

  it('should create a delivery for a store', async () => {
    await tapById('navigate_to_delivery');

    // Pickup address

    // Select default store's address and continue
    await tapById('delivery__next_button');

    // Dropoff address
    await selectAutocompleteAddress('delivery__dropoff__address');

    // Append "\n" to make sure virtual keyboard is hidden after entry
    // https://github.com/wix/detox/issues/209
    await waitToBeVisible('delivery__dropoff__contact_name');
    await typeTextQuick('delivery__dropoff__contact_name', 'Alice\n');

    await waitToBeVisible('delivery__dropoff__phone');
    await typeTextQuick('delivery__dropoff__phone', '0612345678\n');

    await tapById('delivery__next_button');

    // Delivery form

    // Select default values and continue
    await tapById('delivery__next_button');

    // Price form

    // Select default values and continue
    await tapById('delivery__next_button');

    // Return to Store screen and validate new delivery is accessible
    await expect(element(by.text('Alice'))).toBeVisible();
  });
});
