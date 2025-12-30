import {
  describeif,
  loadFixturesAndConnect,
  selectAutocompleteAddress,
  tapById,
  typeTextQuick,
  waitToBeVisible,
} from '../support/commands';
import { loginStoreUser } from './utils';

const CONTACT_NAME = 'Alice';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')(
  'Store - Create delivery',
  () => {
    beforeEach(async () => {
      await loadFixturesAndConnect('store_with_invalid_pricing.yml', true);
      await loginStoreUser();
    });

    it('should create a delivery for a store', async () => {
      await tapById('navigate_to_delivery');

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
      //FIXME: for some reason typeTextQuick behaves strange on CI,
      // await typeTextQuick('address-telephone-input', '0612345678\n');
      await element(by.id('address-telephone-input')).typeText('0612345678\n');

      await tapById('delivery__next_button');

      // Delivery form

      // Select default values and continue
      await tapById('delivery__next_button');

      // Price form

      // Select default values and continue
      await tapById('delivery__next_button');

      // Return to Store screen and validate new delivery is accessible
      await expect(element(by.text('#1'))).toBeVisible();
      await expect(element(by.text(CONTACT_NAME))).toBeVisible();
    });
  },
);
