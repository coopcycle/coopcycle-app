import {
  authenticateWithCredentials,
  closeRestaurantForToday,
  describeif,
  tapById,
  waitToBeVisible,
} from '../../../../support/commands';
import {
  loadCheckoutFixturesAndConnect,
  selectCartItemsFromRestaurant,
} from '../../../utils';

//FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('checkout for customer with existing account (role - user); logged in; with validation failures', () => {

    beforeEach(async () => {
      await loadCheckoutFixturesAndConnect();
      await authenticateWithCredentials('bob', '12345678');
      await selectCartItemsFromRestaurant('Restaurant with cash on delivery');

      // Cart summary page
      // Select a shipping time range
      await tapById('shippingTimeRangeButton');
      // Timing modal page
      await waitToBeVisible('dayPicker');
      await tapById('setShippingTimeRange');
    });

    describe('shippedAt time range became not valid while the customer had been on the Summary page', () => {

      it(`show an error message (Summary page)`, async () => {
        await closeRestaurantForToday(
          'restaurant_with_cash_on_delivery_owner',
          '12345678',
        );

        await tapById('cartSummarySubmit');

        // Error message
        await waitToBeVisible('globalModal');
      });

    });

});
