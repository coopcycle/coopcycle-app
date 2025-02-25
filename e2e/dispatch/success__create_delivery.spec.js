import {
  doLoginForUserWithRoleDispatcher,
  loadDispatchFixture,
} from './utils';
import { itif } from '../utils';

describe('Dispatch - Create delivery', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
  });

  //FIXME: run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
  itif(device.getPlatform() === 'android')(
    `should create a delivery for store from Dispatch`,
    async () => {
      await expect(element(by.id('dispatchNewDelivery'))).toBeVisible();
      await element(by.id('dispatchNewDelivery')).tap();

      // Select store
      await expect(element(by.id('dispatch:storeList:0'))).toBeVisible();
      await element(by.id('dispatch:storeList:0')).tap();

      // Pickup address

      // Select default store's address and continue
      await expect(element(by.id('delivery__next_button'))).toBeVisible();
      await element(by.id('delivery__next_button')).tap();

      // Dropoff address

      await expect(element(by.id('delivery__dropoff__address'))).toBeVisible();
      await element(by.id('delivery__dropoff__address')).typeText('91 rue de rivoli paris');
      await element(by.id('placeId:ChIJQ4sJbyFu5kcRbp6Sp6NLnog')).tap();

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
  });
});
