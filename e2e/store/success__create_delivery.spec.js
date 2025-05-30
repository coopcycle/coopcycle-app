import {
  selectAutocompleteAddress,
} from "../support/commands";
import {
  doLoginForUserWithRoleStore,
  loadStoreFixture,
} from './utils';
import { itif } from '../utils';

describe('Store - Create delivery', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await loadStoreFixture();
    await doLoginForUserWithRoleStore();
  });

  //FIXME: run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
  itif(device.getPlatform() === 'android')(
    `should create a delivery for Store`,
    async () => {
    await expect(element(by.id('navigate_to_delivery'))).toBeVisible();
    await element(by.id('navigate_to_delivery')).tap();

    // Pickup address

    // Select default store's address and continue
    await expect(element(by.id('delivery__next_button'))).toBeVisible();
    await element(by.id('delivery__next_button')).tap();

    // Dropoff address
    await selectAutocompleteAddress('delivery__dropoff__address');

    // Append "\n" to make sure virtual keyboard is hidden after entry
    // https://github.com/wix/detox/issues/209
    await expect(element(by.id('delivery__dropoff__contact_name'))).toBeVisible();
    await element(by.id('delivery__dropoff__contact_name')).typeText('Alice\n');

    await expect(element(by.id('delivery__dropoff__phone'))).toBeVisible();
    await element(by.id('delivery__dropoff__phone')).typeText('0612345678\n');

    await expect(element(by.id('delivery__next_button'))).toBeVisible();
    await element(by.id('delivery__next_button')).tap();

    // Delivery form

    // Select default values and continue
    await expect(element(by.id('delivery__next_button'))).toBeVisible();
    await element(by.id('delivery__next_button')).tap();

    // Price form

    // Select default values and continue
    await expect(element(by.id('delivery__next_button'))).toBeVisible();
    await element(by.id('delivery__next_button')).tap();

    // Return to Store screen and validate new delivery is accessible

    await expect(element(by.text('Alice'))).toBeVisible();
  });
});
