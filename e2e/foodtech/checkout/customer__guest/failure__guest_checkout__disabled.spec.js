import {
  describeif,
  tapById,
  waitToBeVisible,
} from '../../../support/commands';
import {
  loadCheckoutFixturesAndConnect,
  selectCartItemsFromRestaurant,
} from '../../utils';

//FIXME: run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('checkout for guest user; payment - cash on delivery', () => {

  beforeEach(async () => {
    await loadCheckoutFixturesAndConnect(false);
    await selectCartItemsFromRestaurant('Restaurant with cash on delivery');
  });

  it(`should fail to complete checkout`, async () => {
    // Cart summary page
    await tapById('cartSummarySubmit');

    // Authentication page
    await waitToBeVisible('loginUsername');
    await expect(element(by.id('guestCheckoutButton'))).not.toBeVisible();
  });

});
