import {
  addProduct,
  chooseRestaurant,
  connectToLocalInstance,
  connectToSandbox,
  selectAutocompleteAddress,
  symfonyConsole,
} from '../../../support/commands';
import { itif } from '../../../utils';

describe('checkout for guest user; payment - cash on delivery', () => {
  beforeEach(async () => {
    await device.reloadReactNative();

    if (device.getPlatform() === 'android') {
      symfonyConsole(
        'coopcycle:fixtures:load -f cypress/fixtures/checkout.yml',
      );
      await connectToLocalInstance();
    } else {
      //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
      await connectToSandbox();
    }
  });

  //FIXME: run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
  itif(device.getPlatform() === 'android')(
    `should fail to complete checkout`,
    async () => {
      await expect(element(by.id('checkoutAskAddress'))).toBeVisible();

      // Enter address
      await selectAutocompleteAddress('askAddressAutocomplete');

      // List of restaurants
      await expect(element(by.id('checkoutSearch'))).toBeVisible();
      await expect(element(by.id('restaurantList'))).toBeVisible();

      // Choose a restaurant
      await chooseRestaurant('Restaurant with cash on delivery');

      // Restaurant page
      await waitFor(element(by.id('restaurantData')))
        .toExist()
        .withTimeout(5000);
      await waitFor(element(by.id('menuItem:0:0')))
        .toExist()
        .withTimeout(5000);

      // Add item
      await addProduct('menuItem:0:0');

      // Check if footer is present
      await waitFor(element(by.id('cartFooter')))
        .toExist()
        .withTimeout(5000);
      await expect(element(by.id('cartFooter'))).toBeVisible();

      // Add 2 more items
      await addProduct('menuItem:0:1');
      await addProduct('menuItem:1:0');

      await waitFor(element(by.id('cartSubmit')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('cartSubmit')).tap();

      // Cart summary page
      await waitFor(element(by.id('cartSummarySubmit')))
        .toBeVisible()
        .withTimeout(5000);

      await element(by.id('cartSummarySubmit')).tap();

      // Authentication page
      await expect(element(by.id('loginUsername'))).toBeVisible();
      await expect(element(by.id('guestCheckoutButton'))).not.toBeVisible();
    },
  );
});
