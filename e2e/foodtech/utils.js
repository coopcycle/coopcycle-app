import {
  addProduct,
  chooseRestaurant,
  connectToLocalInstance,
  connectToSandbox,
  ifandroid,
  loadFixtures,
  selectAutocompleteAddress,
  symfonyConsole,
  tapById,
  waitToBeVisible,
  waitToExist,
} from "../support/commands";


export async function loadCheckoutFixturesAndConnect(enableGuest = true) {
  return ifandroid(() => {
    loadFixtures('checkout.yml');
    if (enableGuest) {
      symfonyConsole(
        'craue:setting:create --section="general" --name="guest_checkout_enabled" --value="1" --force'
      );
    }
    return connectToLocalInstance();
  }, () => {
    //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
    return connectToSandbox();
  });
}

export async function selectCartItemsFromRestaurant(restaurantName) {
  await waitToBeVisible('checkoutAskAddress');

  // Enter address
  await selectAutocompleteAddress('askAddressAutocomplete');

  // List of restaurants
  await waitToBeVisible('restaurantList');

  // Choose a restaurant
  await chooseRestaurant(restaurantName);

  // Restaurant page
  await waitToExist('restaurantData');
  await waitToExist('menuItem:0:0');

  // Add item
  await addProduct('menuItem:0:0');

  // Add 2 more items
  await addProduct('menuItem:0:1');
  await addProduct('menuItem:1:0');

  await tapById('cartSubmit');
}
