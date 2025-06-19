import {
  authenticateWithCredentials,
  tapById,
  typeTextQuick,
  waitToBeVisible,
} from '../../../support/commands';
import {
  loadCheckoutFixturesAndConnect,
  selectCartItemsFromRestaurant,
} from '../../utils';

describe('checkout for customer with existing account (role - user); logged in; payment - cash on delivery', () => {
  beforeEach(async () => {
    await loadCheckoutFixturesAndConnect();
    await authenticateWithCredentials('bob', '12345678');
    await selectCartItemsFromRestaurant('Restaurant with cash on delivery');
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

    // Payment picker page
    await tapById('paymentMethod-cash_on_delivery');

    // Cash on delivery page
    await tapById('cashOnDeliverySubmit');

    // Confirmation page
    await waitToBeVisible('orderTimeline', 15000);
  });
});
