import axios from 'axios';

const execSync = require('child_process').execSync;
const os = require('os');

// Make sure to have the correct path to the coopcycle-web repository while running locally!
// You can set `COOPCYCLE_WEB_REPO_PATH` at your `.env` file and use Makefile's targets to run the tests
const COOPCYCLE_WEB_REPO_PATH = process.env.COOPCYCLE_WEB_REPO_PATH || '../coopcycle-web';
export const COMMAND_PREFIX = `cd ${COOPCYCLE_WEB_REPO_PATH} && docker compose exec -T php`;

export const symfonyConsole = command => {
  const prefix = COMMAND_PREFIX;
  const cmd = `bin/console ${command} --env="test"`;
  execSync(prefix ? `${prefix} ${cmd}` : cmd)
};

export const launchApp = async () => {
  await device.launchApp({
    delete: true,
    permissions: {
      notifications: 'YES',
      location: 'always',
    },
  });
};

export const disablePasswordAutofill = () => {
  if (device.getPlatform() === 'ios') {
    // disable password autofill: https://github.com/wix/Detox/issues/3761
    execSync(
      `plutil -replace restrictedBool.allowPasswordAutoFill.value -bool NO ~/Library/Developer/CoreSimulator/Devices/${device.id}/data/Containers/Shared/SystemGroup/systemgroup.com.apple.configurationprofiles/Library/ConfigurationProfiles/UserSettings.plist`,
    );
    execSync(
      `plutil -replace restrictedBool.allowPasswordAutoFill.value -bool NO ~/Library/Developer/CoreSimulator/Devices/${device.id}/data/Library/UserConfigurationProfiles/EffectiveUserSettings.plist`,
    );
    execSync(
      `plutil -replace restrictedBool.allowPasswordAutoFill.value -bool NO ~/Library/Developer/CoreSimulator/Devices/${device.id}/data/Library/UserConfigurationProfiles/PublicInfo/PublicEffectiveUserSettings.plist`,
    );
  }
};

export const connectToSandbox = async () => {
  await expect(element(by.id('chooseCityBtn'))).toBeVisible();
  await element(by.id('chooseCityBtn')).tap();

  await expect(element(by.id('moreServerOptions'))).toBeVisible();
  await element(by.id('moreServerOptions')).tap();

  await element(by.id('customServerURL')).typeText(
    'sandbox-fr.coopcycle.org\n',
  );

  try {
    // We deliberately add "\n" to hide the keyboard
    // The tap below shouldn't be necessary
    await element(by.id('submitCustomServer')).tap();
  } catch (e) {}
};

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
};

const getLocalInstanceUrl = () => `http://${getLocalIpAddress()}:9080`;

export const connectToLocalInstance = async () => {
  await expect(element(by.id('chooseCityBtn'))).toBeVisible();
  await element(by.id('chooseCityBtn')).tap();

  await expect(element(by.id('moreServerOptions'))).toBeVisible();
  await element(by.id('moreServerOptions')).tap();

  await element(by.id('customServerURL')).typeText(
    `${getLocalInstanceUrl()}\n`,
  );

  try {
    // We deliberately add "\n" to hide the keyboard
    // The tap below shouldn't be necessary
    await element(by.id('submitCustomServer')).tap();
  } catch (e) {}
};

export const authenticateWithCredentials = async (username, password) => {
  await expect(element(by.id('menuBtn'))).toBeVisible();
  await element(by.id('menuBtn')).tap();

  await element(by.id('drawerAccountBtn')).tap();
  //FIXME: for some reason drawer menu does not close after the first tap on Android
  if (device.getPlatform() === 'android') {
    const attrs = await element(by.id('drawerAccountBtn')).getAttributes();
    if (attrs.visible) {
      await element(by.id('drawerAccountBtn')).tap();
    }
  }

  await element(by.id('loginUsername')).typeText(`${username}\n`);
  await element(by.id('loginPassword')).typeText(`${password}\n`);

  // As we are using "\n", the form may have been submitted yet
  try {
    await element(by.id('loginSubmit')).tap();
  } catch (e) {}
};

export const logout = async (username, password) => {
  // await expect(element(by.id('menuBtn'))).toBeVisible()
  // await waitFor(element(by.id('menuBtn'))).toExist().withTimeout(5000)

  // Multiple elements were matched: (
  //     "<RCTView:0x7fd151feba00; AX=Y; AX.id='menuBtn'; AX.label='\Uf32a'; AX.frame={{0, 3001.5}, {61, 41}}; AX.activationPoint={30.5, 3022}; AX.traits='UIAccessibilityTraitNone'; AX.focused='N'; frame={{0, 1.5}, {61, 41}}; opaque; alpha=1>",
  //     "<RCTView:0x7fd155a60320; AX=Y; AX.id='menuBtn'; AX.label='\Uf32a'; AX.frame={{0, 21.5}, {61, 41}}; AX.activationPoint={30.5, 42}; AX.traits='UIAccessibilityTraitNone'; AX.focused='N'; frame={{0, 1.5}, {61, 41}}; opaque; alpha=1>",
  //     "<RCTView:0x7fd151ea12d0; AX=Y; AX.id='menuBtn'; AX.label='\Uf32a'; AX.frame={{0, 3001.5}, {61, 41}}; AX.activationPoint={30.5, 3022}; AX.traits='UIAccessibilityTraitNone'; AX.focused='N'; frame={{0, 1.5}, {61, 41}}; opaque; alpha=1>"
  // ). Please use selection matchers to narrow the selection down to single element.
  // await element(by.id('menuBtn')).atIndex(0).tap()

  await element(by.id('drawerAccountBtn')).tap();

  await element(by.id('logout')).tap();
};

export const chooseRestaurant = async restaurantName => {
  try {
    await expect(element(by.label(restaurantName))).toBeVisible();
  } catch (e) {
    await waitFor(element(by.label(restaurantName)))
      .toBeVisible()
      .whileElement(by.id('restaurantList'))
      .scroll(120, 'down');
  }
  await element(by.label(restaurantName)).tap();
};

export const addProduct = async id => {
  try {
    await expect(element(by.id(id))).toBeVisible();
  } catch (e) {
    //FIXME: make scroll more flexible or use
    // await element(by.id('restaurantData')).scrollToIndex(0);
    // instead
    await waitFor(element(by.id(id)))
      .toBeVisible()
      .whileElement(by.id('restaurantData'))
      .scroll(180, 'down');
  }

  await element(by.id(id)).tap();

  try {
    // Product details page
    await waitFor(element(by.id('productDetails')))
      .toBeVisible()
      .withTimeout(1000);
  } catch (e) {
    //FIXME: it seems that sometimes the tap does not work on the first try
    await element(by.id(id)).tap();
  }

  // FIXME: with a local coopcycle-web instance, we'll have more control over the test data
  // As there is no way to know the number of sections,
  // we try with 10 sections
  for (let section = 0; section < 10; section++) {
    try {
      await element(by.id(`productOptions:${section}:0`)).tap();
    } catch (e) {
      // ignore errors if a section does not have any option
    }
  }

  await element(by.id('addProduct')).tap();
};

const stripeUiElement = (androidLabel, iOSLabel) => {
  if (device.getPlatform() === 'android') {
    return element(
      by.type('android.widget.EditText').withAncestor(by.label(androidLabel)),
    );
  } else if (device.getPlatform() === 'ios') {
    return element(by.label(iOSLabel).and(by.type('UITextField')));
  } else {
    throw new Error('Unsupported platform');
  }
};

const cardNumberElement = () => stripeUiElement('Card number', 'card number');
const expirationDateElement = () =>
  stripeUiElement('Expiration date', 'expiration date');
const cvvElement = () => stripeUiElement('CVC', 'CVC');

/**
 * see https://docs.stripe.com/testing for more test card numbers
 */
export const enterValidCreditCard = async () => {
  // Tap the credit card input to make sure we can interact with it
  await cardNumberElement().tap();

  await cardNumberElement().typeText('4242424242424242');
  await expirationDateElement().typeText('1228');
  // Add "\n" to make sure keyboard is hidden
  await cvvElement().typeText('123\n');
};

export const closeRestaurantForToday = async (username, password) => {
  try {
    // Get API token
    const loginResponse = await axios.post(
      `${getLocalInstanceUrl()}/api/login_check`,
      {
        _username: username,
        _password: password,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const token = loginResponse.data.token;

    // Get list of restaurants
    const myRestaurantsResponse = await axios.get(
      `${getLocalInstanceUrl()}/api/me/restaurants`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const restaurants = myRestaurantsResponse.data['hydra:member'];

    // Close each restaurant
    for (const restaurant of restaurants) {
      await axios.put(
        `${getLocalInstanceUrl()}/api/restaurants/${restaurant.id}/close`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(`Restaurant ${restaurant.id}; ${restaurant.name} is closed`);
    }
  } catch (error) {
    console.error('Error closing restaurants:', error);
  }
};

export const selectAutocompleteAddress = async (
  elemId,
  address='91 rue de rivoli paris',
  placeId='Eh85MSBSdWUgZGUgUml2b2xpLCBQYXJpcywgRnJhbmNlIjASLgoUChIJmeuzXiFu5kcRwuW58Y4zYxgQWyoUChIJt4MohSFu5kcRUHvqO0vC-Ig'
) => {
  await waitFor(element(by.id(elemId)))
    .toExist()
    .withTimeout(5000);
  await element(by.id(elemId)).typeText(address);
  await element(by.id(`placeId:${placeId}`)).tap();
};
