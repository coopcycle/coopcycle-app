import {
  addProduct,
  chooseRestaurant,
  closeRestaurantForToday,
  connectToLocalInstance,
  connectToSandbox,
  launchApp,
  symfonyConsole,
} from '../../../support/commands';
import { describeif } from '../../../utils';

//FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')(
  'checkout for guest user; with validation failures',
  () => {
    beforeEach(async () => {
      await launchApp();

      if (device.getPlatform() === 'android') {
        symfonyConsole(
          'coopcycle:fixtures:load -f cypress/fixtures/checkout.yml',
        );
        symfonyConsole(
          'craue:setting:create --section="general" --name="guest_checkout_enabled" --value="1" --force',
        );
        await connectToLocalInstance();
      } else {
        //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
        await connectToSandbox();
      }

      // Enter address
      await waitFor(element(by.id('askAddressAutocomplete')))
        .toExist()
        .withTimeout(5000);
      await element(by.id('askAddressAutocomplete')).typeText(
        '91 rue de rivoli paris',
      );
      await element(by.id('placeId:ChIJQ4sJbyFu5kcRbp6Sp6NLnog')).tap();

      // List of restaurants
      await expect(element(by.id('restaurantList'))).toBeVisible();
      await chooseRestaurant('Restaurant with cash on delivery');

      // Restaurant page
      await waitFor(element(by.id('restaurantData')))
        .toExist()
        .withTimeout(5000);
      await waitFor(element(by.id('menuItem:0:0')))
        .toExist()
        .withTimeout(5000);

      // Add item
      await addProduct('menuItem:0:0');

      // Check if footer is present
      await waitFor(element(by.id('cartFooter')))
        .toExist()
        .withTimeout(5000);
      await expect(element(by.id('cartFooter'))).toBeVisible();

      // Add 2 more items
      await addProduct('menuItem:0:1');
      await addProduct('menuItem:1:0');

      await waitFor(element(by.id('cartSubmit')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('cartSubmit')).tap();

      // Cart summary page
      // Select a shipping time range
      await element(by.id('shippingTimeRangeButton')).tap();
      // Timing modal page
      await waitFor(element(by.id('dayPicker')))
        .toBeVisible()
        .withTimeout(15000);
      await element(by.id('setShippingTimeRange')).tap();
    });

    describe('shippedAt time range became not valid while the customer had been on the Summary page', () => {
      it(`show an error message (Summary page)`, async () => {
        await closeRestaurantForToday(
          'restaurant_with_cash_on_delivery_owner',
          '12345678',
        );

        await element(by.id('cartSummarySubmit')).tap();

        // Error message
        await waitFor(element(by.id('globalModal')))
          .toBeVisible()
          .withTimeout(5000);
      });
    });

    describe('shippedAt time range became not valid while the customer had been on the More page', () => {
      it(`show an error message (More page)`, async () => {
        await element(by.id('cartSummarySubmit')).tap();

        // Authentication page
        await expect(element(by.id('loginUsername'))).toBeVisible();

        try {
          await element(by.id('guestCheckoutButton')).tap();
        } catch (e) {}

        // More infos page
        await expect(element(by.id('guestCheckoutEmail'))).toBeVisible();
        await expect(element(by.id('checkoutTelephone'))).toBeVisible();
        await expect(element(by.id('moreInfosSubmit'))).toBeVisible();

        await element(by.id('guestCheckoutEmail')).typeText(
          'e2e-mobile@demo.coopcycle.org',
        );

        // Append "\n" to make sure virtual keybord is hidden after entry
        // https://github.com/wix/detox/issues/209
        await element(by.id('checkoutTelephone')).typeText('0612345678');
        await element(by.id('checkoutTelephone')).typeText('\n');

        await closeRestaurantForToday(
          'restaurant_with_cash_on_delivery_owner',
          '12345678',
        );

        await element(by.id('moreInfosSubmit')).tap();

        // Error message
        await waitFor(element(by.id('globalModal')))
          .toBeVisible()
          .withTimeout(5000);
      });
    });

    describe('shippedAt time range became not valid while the customer had been on the Payment page', () => {
      it(`show an error message (Payment page)`, async () => {
        await element(by.id('cartSummarySubmit')).tap();

        // Authentication page
        await expect(element(by.id('loginUsername'))).toBeVisible();

        try {
          await element(by.id('guestCheckoutButton')).tap();
        } catch (e) {}

        // More infos page
        await expect(element(by.id('guestCheckoutEmail'))).toBeVisible();
        await expect(element(by.id('checkoutTelephone'))).toBeVisible();
        await expect(element(by.id('moreInfosSubmit'))).toBeVisible();

        await element(by.id('guestCheckoutEmail')).typeText(
          'e2e-mobile@demo.coopcycle.org',
        );

        // Append "\n" to make sure virtual keybord is hidden after entry
        // https://github.com/wix/detox/issues/209
        await element(by.id('checkoutTelephone')).typeText('0612345678');
        await element(by.id('checkoutTelephone')).typeText('\n');

        await element(by.id('moreInfosSubmit')).tap();

        // Payment picker page
        //FIXME: temporary skip for Android until Stripe is configured
        if (device.getPlatform() === 'ios') {
          await expect(
            element(by.id('paymentMethod-cash_on_delivery')),
          ).toBeVisible();
          await element(by.id('paymentMethod-cash_on_delivery')).tap();
        }

        // Cash on delivery page
        await expect(element(by.id('cashOnDeliverySubmit'))).toBeVisible();

        await closeRestaurantForToday(
          'restaurant_with_cash_on_delivery_owner',
          '12345678',
        );

        await element(by.id('cashOnDeliverySubmit')).tap();

        // Error message
        await waitFor(element(by.id('globalModal')))
          .toBeVisible()
          .withTimeout(5000);
      });
    });
  },
);
