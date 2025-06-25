import {
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
  ('checkout for customer guest user; Time range changed modal', () => {

  beforeEach(async () => {
    await loadCheckoutFixturesAndConnect();
    await selectCartItemsFromRestaurant('Restaurant with cash on delivery');
  });

  describe('restaurant was closed while the customer had been on the Summary page', () => {

    it(`should suggest to choose a new time range (Timing modal)`, async () => {
      await closeRestaurantForToday(
        'restaurant_with_cash_on_delivery_owner',
        '12345678',
      );

      // Cart summary page
      await tapById('cartSummarySubmit');

      // Time range changed modal
      await waitToBeVisible('timeRangeChangedModal');

      // Select a shipping time range
      await tapById('setShippingTimeRange');

      await tapById('cartSummarySubmit');

      // Authentication page
      await waitToBeVisible('loginUsername');
    });

  });

});
