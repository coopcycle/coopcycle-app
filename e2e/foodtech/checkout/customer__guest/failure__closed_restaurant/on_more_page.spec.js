import {
  closeRestaurantForToday,
  describeif,
  tapById,
  typeTextQuick,
  waitToBeVisible,
} from '../../../../support/commands';
import {
  loadCheckoutFixturesAndConnect,
  selectCartItemsFromRestaurant,
} from '../../../utils';

//FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('checkout for customer guest user; Time range changed modal', () => {

  beforeEach(async () => {
    await loadCheckoutFixturesAndConnect();
    await selectCartItemsFromRestaurant('Restaurant with cash on delivery');
  });

  describe('restaurant was closed while the customer had been on the More page', () => {

    it(`should suggest to choose a new time range (Timing modal)`, async () => {
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

      await closeRestaurantForToday(
        'restaurant_with_cash_on_delivery_owner',
        '12345678',
      );

      await tapById('moreInfosSubmit');

      // Time range changed modal
      await waitToBeVisible('timeRangeChangedModal');

      // Select a shipping time range
      await tapById('setShippingTimeRange');

      await tapById('moreInfosSubmit');

      // Payment picker page
      await tapById('paymentMethod-cash_on_delivery', 10000);

      // Cash on delivery page
      await tapById('cashOnDeliverySubmit', 10000);
    });

  });

});
