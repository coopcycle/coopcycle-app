import {
  addProduct,
  authenticateWithCredentials,
  chooseRestaurant,
  connectToLocalInstance,
  connectToSandbox,
  disablePasswordAutofill,
  symfonyConsole,
} from '../../../utils';

describe('checkout for customer with existing account (role - user); logged in; payment - cash on delivery', () => {
  beforeEach(async () => {
    disablePasswordAutofill();

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

    await authenticateWithCredentials('bob', '12345678');
  });

  it(`should complete checkout`, async () => {
    await expect(element(by.id('checkoutAskAddress'))).toBeVisible();

    // Enter address
    await waitFor(element(by.id('askAddressAutocomplete')))
      .toExist()
      .withTimeout(5000);
    await element(by.id('askAddressAutocomplete')).typeText(
      '91 rue de rivoli paris',
    );
    await element(by.id('placeId:ChIJQ4sJbyFu5kcRbp6Sp6NLnog')).tap();

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
    await expect(element(by.id('cartSummarySubmit'))).toBeVisible();

    await element(by.id('cartSummarySubmit')).tap();

    // More infos page
    await expect(element(by.id('checkoutTelephone'))).toBeVisible();
    await expect(element(by.id('moreInfosSubmit'))).toBeVisible();

    // Append "\n" to make sure virtual keybord is hidden after entry
    // https://github.com/wix/detox/issues/209
    await element(by.id('checkoutTelephone')).typeText('0612345678');
    await element(by.id('checkoutTelephone')).typeText('\n');

    await element(by.id('moreInfosSubmit')).tap();

    // Payment picker page
    //FIXME: temporary skip for Android, to debug test failures on CI
    if (device.getPlatform() === 'ios') {
      await expect(
        element(by.id('paymentMethod-cash_on_delivery')),
      ).toBeVisible();
      await element(by.id('paymentMethod-cash_on_delivery')).tap();
    }

    // Cash on delivery page
    await expect(element(by.id('cashOnDeliverySubmit'))).toBeVisible();
    await element(by.id('cashOnDeliverySubmit')).tap();

    // Confirmation page
    await waitFor(element(by.id('orderTimeline')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
