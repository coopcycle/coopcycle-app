import {
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
describeif(device.getPlatform() === 'android')
  ('checkout for guest user; payment - stripe', () => {

  beforeEach(async () => {
    await loadCheckoutFixturesAndConnect();
    await selectCartItemsFromRestaurant('Crazy Hamburger');
  });

  it(`should complete checkout`, async () => {
    // Cart summary page
    await tapById('cartSummarySubmit');

    // Authentication page
    await waitToBeVisible('loginUsername');

    try {
      await tapById('guestCheckoutButton');
    } catch (e) {}

    // More infos page
    await waitToBeVisible('guestCheckoutEmail');
    await waitToBeVisible('checkoutTelephone');
    await waitToBeVisible('moreInfosSubmit');

    await typeTextQuick('guestCheckoutEmail', 'e2e-mobile@demo.coopcycle.org');

    // Append "\n" to make sure virtual keybord is hidden after entry
    // https://github.com/wix/detox/issues/209
    await typeTextQuick('checkoutTelephone', '0612345678\n');

    await tapById('moreInfosSubmit');

    // Payment page
    await typeTextQuick('cardholderName', 'John Doe');

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

});
