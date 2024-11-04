import { initTest } from './beforeEach';
import { describeif } from '../../../../utils';
import { closeRestaurantForToday } from '../../../../support/commands';

//FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')(
  'checkout for customer with existing account (role - user); logged in; Time range changed modal; restaurant was closed while the customer had been on the More page',
  () => {
    beforeEach(async () => {
      await initTest();
    });

    it(`should suggest to choose a new time range (Timing modal)`, async () => {
      // Cart summary page
      await element(by.id('cartSummarySubmit')).tap();

      // More infos page
      await expect(element(by.id('checkoutTelephone'))).toBeVisible();
      await expect(element(by.id('moreInfosSubmit'))).toBeVisible();

      // Append "\n" to make sure virtual keybord is hidden after entry
      // https://github.com/wix/detox/issues/209
      await element(by.id('checkoutTelephone')).typeText('0612345678');
      await element(by.id('checkoutTelephone')).typeText('\n');

      await closeRestaurantForToday(
        'restaurant_with_cash_on_delivery_owner',
        '12345678',
      );

      await element(by.id('moreInfosSubmit')).tap();

      // Time range changed modal
      await waitFor(element(by.id('timeRangeChangedModal')))
        .toBeVisible()
        .withTimeout(5000);
      // Select a shipping time range
      await element(by.id('setShippingTimeRange')).tap();

      await element(by.id('moreInfosSubmit')).tap();

      // Payment picker page
      await expect(
        element(by.id('paymentMethod-cash_on_delivery')),
      ).toBeVisible();
      await element(by.id('paymentMethod-cash_on_delivery')).tap();

      // Cash on delivery page
      await waitFor(element(by.id('cashOnDeliverySubmit'))).toBeVisible().withTimeout(5000);
    });
  },
);
