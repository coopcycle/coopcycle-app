import {
  addProduct,
  authenticateWithCredentials,
  chooseRestaurant,
  connectToLocalInstance,
  connectToSandbox,
  describeif,
  enterValidCreditCard,
  selectAutocompleteAddress,
  symfonyConsole,
  tapById,
  typeTextQuick,
  waitToBeVisible,
  waitToExist,
} from '../../../support/commands';

//FIXME: run on iOS too; see Stripe-related issues below
describeif(device.getPlatform() === 'android')(
  'checkout for customer with existing account (role - user); logged in; payment - stripe',
  () => {
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
      await chooseRestaurant('Crazy Hamburger');

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

      await tapById('creditCardSubmit');

      // Confirmation page
      await waitToBeVisible('orderTimeline', 15000);
    });
  },
);
