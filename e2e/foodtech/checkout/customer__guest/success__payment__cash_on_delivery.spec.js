import {
  addProduct,
  chooseRestaurant,
  connectToLocalInstance,
  connectToSandbox,
  symfonyConsole,
} from '../../../support/commands';

describe('checkout for guest user; payment - cash on delivery', () => {
  beforeEach(async () => {
    await device.reloadReactNative();

    if (device.getPlatform() === 'android') {
      symfonyConsole(
        'coopcycle:fixtures:load -f cypress/fixtures/checkout.yml',
      );
      symfonyConsole(
        'craue:setting:create --section="general" --name="guest_checkout_enabled" --value="1" --force',
      );
      await connectToLocalInstance();
    } else {
      //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
      await connectToSandbox();
    }
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
    await waitFor(element(by.id('cartSummarySubmit')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('cartSummarySubmit')).tap();

    // Authentication page
    await expect(element(by.id('loginUsername'))).toBeVisible();

    try {
      await element(by.id('guestCheckoutButton')).tap();
    } catch (e) {}

    // More infos page
    await expect(element(by.id('guestCheckoutEmail'))).toBeVisible();
    await expect(element(by.id('checkoutTelephone'))).toBeVisible();
    await expect(element(by.id('moreInfosSubmit'))).toBeVisible();

    await element(by.id('guestCheckoutEmail')).typeText(
      'e2e-mobile@demo.coopcycle.org',
    );

    // Append "\n" to make sure virtual keybord is hidden after entry
    // https://github.com/wix/detox/issues/209
    await element(by.id('checkoutTelephone')).typeText('0612345678');
    await element(by.id('checkoutTelephone')).typeText('\n');

    await element(by.id('moreInfosSubmit')).tap();

    // Payment picker page
    await expect(
      element(by.id('paymentMethod-cash_on_delivery')),
    ).toBeVisible();
    await element(by.id('paymentMethod-cash_on_delivery')).tap();

    // Cash on delivery page
    await expect(element(by.id('cashOnDeliverySubmit'))).toBeVisible();
    await element(by.id('cashOnDeliverySubmit')).tap();

    // Confirmation page
    await waitFor(element(by.id('orderTimeline')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
