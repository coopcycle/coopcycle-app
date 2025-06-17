import {
  describeif,
  selectAutocompleteAddress,
  tapById,
  typeTextQuick,
} from "../support/commands";
import {
  doLoginForUserWithRoleStore,
  loadStoreFixture,
  relaunchCleanApp,
} from './utils';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Store - Create delivery', () => {

  beforeEach(async () => {
    await relaunchCleanApp();
    await loadStoreFixture();
    await doLoginForUserWithRoleStore();
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
    await expect(element(by.id('delivery__dropoff__contact_name'))).toBeVisible();
    await typeTextQuick('delivery__dropoff__contact_name', 'Alice\n');

    await expect(element(by.id('delivery__dropoff__phone'))).toBeVisible();
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
