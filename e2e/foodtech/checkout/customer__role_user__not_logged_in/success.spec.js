import {
  tapById,
  typeTextQuick,
  waitToBeVisible,
} from '../../../support/commands';
import {
  loadCheckoutFixturesAndConnect,
  selectCartItemsFromRestaurant,
} from '../../utils';

describe('checkout for customer with existing account (role - user); not logged in yet; payment - cash on delivery', () => {

  beforeEach(async () => {
    await loadCheckoutFixturesAndConnect();
  });

  it(`should complete checkout`, async () => {
    await selectCartItemsFromRestaurant('Restaurant with cash on delivery');

    // Cart summary page
    await tapById('cartSummarySubmit');

    // Authentication page
    await waitToBeVisible('loginUsername');
    await typeTextQuick('loginUsername', 'bob\n');
    await typeTextQuick('loginPassword', '12345678\n');

    // As we are using "\n", the form may have been submitted yet
    try {
      await tapById('loginSubmit');
    } catch (e) {}

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
