import {
  tapById,
  typeTextQuick,
  waitToBeVisible,
} from '../../../support/commands';
import {
  loadCheckoutFixturesAndConnect,
  selectCartItemsFromRestaurant,
} from '../../utils';

describe('checkout for guest user; payment - cash on delivery', () => {

  beforeEach(async () => {
    await loadCheckoutFixturesAndConnect();
    await selectCartItemsFromRestaurant('Restaurant with cash on delivery');
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

    await typeTextQuick('guestCheckoutEmail', 'e2e-mobile@demo.coopcycle.org\n');

    // Append "\n" to make sure virtual keybord is hidden after entry
    // https://github.com/wix/detox/issues/209
    await typeTextQuick('checkoutTelephone', '0612345678\n');

    await tapById('moreInfosSubmit');

    // Payment picker page
    await tapById('paymentMethod-cash_on_delivery', 10000);

    // Cash on delivery page
    await tapById('cashOnDeliverySubmit', 10000);

    // Confirmation page
    await waitToBeVisible('orderTimeline', 15000);
  });

});
