import {
  authenticateWithCredentials,
  describeif,
  enterValidCreditCard,
  tapById,
  typeTextQuick,
  waitToBeVisible,
} from '../../../support/commands';
import {
  loadCheckoutFixturesAndConnect,
  selectCartItemsFromRestaurant,
} from '../../utils';

//FIXME: run on iOS too; see Stripe-related issues below
describeif(device.getPlatform() === 'android')(
  'checkout for customer with existing account (role - user); logged in; payment - stripe',
  () => {
    beforeEach(async () => {
      await loadCheckoutFixturesAndConnect();
      await authenticateWithCredentials('bob', '12345678');
      await selectCartItemsFromRestaurant('Crazy Hamburger');
    });

    it(`should complete checkout`, async () => {
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
