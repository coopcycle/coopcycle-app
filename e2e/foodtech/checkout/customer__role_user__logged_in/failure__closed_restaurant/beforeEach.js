import {
  addProduct,
  authenticateWithCredentials,
  chooseRestaurant,
  connectToLocalInstance,
  connectToSandbox,
  launchApp,
  symfonyConsole,
} from '../../../../support/commands';

export const initTest = async () => {
  await launchApp();

  if (device.getPlatform() === 'android') {
    symfonyConsole('coopcycle:fixtures:load -f cypress/fixtures/checkout.yml');
    await connectToLocalInstance();
  } else {
    //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
    await connectToSandbox();
  }

  await authenticateWithCredentials('bob', '12345678');

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
};
