import {
  addProduct,
  authenticateWithCredentials,
  chooseRestaurant,
  connectToLocalInstance,
  connectToSandbox,
  disablePasswordAutofill,
  symfonyConsole,
} from '../../../utils';
import { describe } from 'jest-circus';

describe.skip('checkout for customer with existing account (role: user); logged in; payment: stripe', () => {
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

    // FIXME; test payment via Stripe as well
    //  Android: there are at least 2 issues with Stripe in the tests:
    //  1. sometimes the app fails with java.lang.IllegalStateException: PaymentConfiguration was not initialized. Call PaymentConfiguration.init().
    //     might be related to: https://github.com/coopcycle/coopcycle-app/issues/1841
    //  2. find a way to match stripe elements; see https://github.com/stripe/stripe-react-native/issues/1326
    //     Try labels like 'Card number', 'Expiration date', 'CVC' (check the LayoutInspector in Android Studio)
    //  iOS: Test Failed: View is not hittable at its visible point. Error: View is not visible around point.
    //    - view point: {100, 25}
    //    - visible bounds: {{118, 0}, {82, 50}}
    //    - view bounds: {{-118, 0}, {200, 50}}
    //   ---
    //   Error: Error Domain=DetoxErrorDomain Code=0 "View “<StripePaymentsUI.STPFormTextField: 0x7fe7a6649800>” is not visible: View does not pass visibility percent threshold (100)"
    if (device.getPlatform() !== 'android' && device.getPlatform() !== 'ios') {
      // Payment page
      await element(by.id('cardholderName')).typeText('John Doe');

      // Tap the credit card input to make sure we can interact with it
      await element(by.id('creditCardWrapper')).tap();

      await element(by.label('card number')).typeText('4242424242424242');

      await element(by.label('expiration date')).typeText('1228');
      // Add "\n" to make sure keyboard is hidden
      await element(by.label('CVC').and(by.type('UITextField'))).typeText(
        '123\n',
      );

      await element(by.id('creditCardSubmit')).tap();
    }

    // Confirmation page
    await waitFor(element(by.id('orderTimeline')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
