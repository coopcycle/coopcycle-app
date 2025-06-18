import {
  addProduct,
  authenticateWithCredentials,
  chooseRestaurant,
  connectToLocalInstance,
  connectToSandbox,
  selectAutocompleteAddress,
  symfonyConsole,
  tapById,
  typeTextQuick,
  waitToBeVisible,
  waitToExist,
} from '../../../support/commands';

describe('checkout for customer with existing account (role - user); logged in; payment - cash on delivery', () => {
  beforeEach(async () => {
    if (device.getPlatform() === 'android') {
      symfonyConsole(
        'coopcycle:fixtures:load -f cypress/fixtures/checkout.yml',
      );
      await connectToLocalInstance();
    } else {
      //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
      await connectToSandbox();
    }

    await authenticateWithCredentials('bob', '12345678');
  });

  it(`should complete checkout`, async () => {
    await waitToBeVisible('checkoutAskAddress');

    // Enter address
    await selectAutocompleteAddress('askAddressAutocomplete');

    // List of restaurants
    await waitToBeVisible('restaurantList');

    // Choose a restaurant
    await chooseRestaurant('Restaurant with cash on delivery');

    // Restaurant page
    await waitToExist('restaurantData');
    await waitToExist('menuItem:0:0');

    // Add item
    await addProduct('menuItem:0:0');

    // Add 2 more items
    await addProduct('menuItem:0:1');
    await addProduct('menuItem:1:0');

    await tapById('cartSubmit');

    // Cart summary page
    await tapById('cartSummarySubmit');

    // More infos page
    await waitToBeVisible('checkoutTelephone');
    await waitToBeVisible('moreInfosSubmit');

    // Append "\n" to make sure virtual keybord is hidden after entry
    // https://github.com/wix/detox/issues/209
    await typeTextQuick('checkoutTelephone', '0612345678\n');

    await tapById('moreInfosSubmit');

    // Payment picker page
    await tapById('paymentMethod-cash_on_delivery');

    // Cash on delivery page
    await tapById('cashOnDeliverySubmit');

    // Confirmation page
    await waitToBeVisible('orderTimeline', 15000);
  });
});
