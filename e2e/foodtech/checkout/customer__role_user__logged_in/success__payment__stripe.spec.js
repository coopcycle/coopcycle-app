import {
  addProduct,
  authenticateWithCredentials,
  chooseRestaurant,
  connectToLocalInstance,
  connectToSandbox,
  enterValidCreditCard,
  selectAutocompleteAddress,
  symfonyConsole,
} from '../../../support/commands';

import { describeif } from '../../../utils';

//FIXME: run on iOS too; see Stripe-related issues below
describeif(device.getPlatform() === 'android')(
  'checkout for customer with existing account (role - user); logged in; payment - stripe',
  () => {
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

      await authenticateWithCredentials('bob', '12345678');
    });

    it(`should complete checkout`, async () => {
      await expect(element(by.id('checkoutAskAddress'))).toBeVisible();

      // Enter address
      await selectAutocompleteAddress('askAddressAutocomplete');

      // List of restaurants
      await expect(element(by.id('restaurantList'))).toBeVisible();

      // Choose a restaurant
      await chooseRestaurant('Crazy Hamburger');

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

      // More infos page
      await expect(element(by.id('checkoutTelephone'))).toBeVisible();
      await expect(element(by.id('moreInfosSubmit'))).toBeVisible();

      // Append "\n" to make sure virtual keybord is hidden after entry
      // https://github.com/wix/detox/issues/209
      await element(by.id('checkoutTelephone')).typeText('0612345678');
      await element(by.id('checkoutTelephone')).typeText('\n');

      await element(by.id('moreInfosSubmit')).tap();

      // Payment page
      await element(by.id('cardholderName')).typeText('John Doe');

      // FIXME; test payment via Stripe as well
      //  iOS: Test Failed: View is not hittable at its visible point. Error: View is not visible around point.
      //    - view point: {100, 25}
      //    - visible bounds: {{118, 0}, {82, 50}}
      //    - view bounds: {{-118, 0}, {200, 50}}
      //   ---
      //   Error: Error Domain=DetoxErrorDomain Code=0 "View “<StripePaymentsUI.STPFormTextField: 0x7fe7a6649800>” is not visible: View does not pass visibility percent threshold (100)"
      await enterValidCreditCard();

      await element(by.id('creditCardSubmit')).tap();

      // Confirmation page
      await waitFor(element(by.id('orderTimeline')))
        .toBeVisible()
        .withTimeout(15000);
    });
  },
);
