import axios from 'axios';

const execSync = require('child_process').execSync;
const os = require('os');

// Make sure to have the correct path to the coopcycle-web repository while running locally!
// You can set `COOPCYCLE_WEB_REPO_PATH` at your `.env` file and use Makefile's targets to run the tests
const COOPCYCLE_WEB_REPO_PATH = process.env.COOPCYCLE_WEB_REPO_PATH || '../coopcycle-web';
export const COMMAND_PREFIX = `cd ${COOPCYCLE_WEB_REPO_PATH} && docker compose exec -T php`;

export const symfonyConsole = command => {
  const prefix = COMMAND_PREFIX;
  let cmd = `bin/console ${command} --env="test"`;
  cmd = prefix ? `${prefix} ${cmd}` : cmd;
  console.log(`Executing command: ${cmd}`);
  return execSync(cmd);
};

export const launchApp = () => {
  console.log('Launching app..');
  return device.launchApp({
    delete: true,
    permissions: {
      notifications: 'YES',
      location: 'always',
    },
  });
};

export const describeif = condition => (condition ? describe : describe.skip);
// eslint-disable-next-line no-undef
export const itif = condition => (condition ? it : it.skip);
export const ifandroid = (onTrue, onFalse = () => {}) => (device.getPlatform() === 'android' ? onTrue() : onFalse());
export const ifios = (onTrue, onFalse = () => {}) => (device.getPlatform() === 'ios' ? onTrue() : onFalse());

export const disablePasswordAutofill = () => {
  ifios(() => {
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
  });
};

export const connectToSandbox = async (url = "sandbox-fr.coopcycle.org") => {
  return await connectToInstance("sandbox-fr.coopcycle.org");
};

export const connectToLocalInstance = async () => {
  return await connectToInstance(getLocalInstanceUrl());
};

const connectToInstance = async (url) => {
  console.log(`Connecting to instance at "${url}"`);
  await tapById('chooseCityBtn');
  await tapById('moreServerOptions');

  await typeTextQuick('customServerURL', `${url}\n`);

  try {
    // We deliberately add "\n" to hide the keyboard
    // The tap below shouldn't be necessary
    await tapById('submitCustomServer');
  } catch (e) {}
};

const getLocalInstanceUrl = () => `http://${getLocalIpAddress()}:9080`;

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

export const loadFixtures = (fixtures, setup = false) => {
  const basePath = "cypress/fixtures";
  const fixturesString = (Array.isArray(fixtures) ? fixtures : [fixtures]).map(f => `-f ${basePath}/${f}`).join(' ')
  console.log(`Loading fixture/s (setup: ${setup}): ${fixturesString}`);
  return symfonyConsole(`coopcycle:fixtures:load${setup ? ` -s ${basePath}/setup_default.yml` : ''} ${fixturesString}`)
};

export const loadFixturesWithSetup = (fixtures) => {
  return loadFixtures(fixtures, true);
};

export const loadFixturesAndConnect = async (fixtures, setup = false) => {
  return ifandroid(() => {
    loadFixtures(fixtures, setup);
    return connectToLocalInstance();
  }, () => {
    //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
    return connectToSandbox();
  });
};

export const authenticateWithCredentials = async (username, password) => {
  console.log(`Authenticating with "${username}:${password}"`);
  await tapById('menuBtn');

  await tapById('drawerAccountBtn');
  //FIXME: for some reason drawer menu does not close after the first tap on Android
  await ifandroid(async () => {
    const attrs = await element(by.id('drawerAccountBtn')).getAttributes();
    if (attrs.visible) {
      await tapById('drawerAccountBtn');
    }
  });

  await typeTextQuick('loginUsername', `${username}\n`);
  await typeTextQuick('loginPassword', `${password}\n`);

  // As we are using "\n", the form may have been submitted yet
  try {
    await tapById('loginSubmit');
  } catch (e) {}
};

export const logout = async () => {
  console.log(`Logging out user..`);
  await tapById('drawerAccountBtn');
  return await tapById('logout');
};

export const chooseRestaurant = async restaurantName => {
  console.log(`Choosing restaurant "${restaurantName}"`);
  try {
    await expect(element(by.label(restaurantName))).toBeVisible();
  } catch (e) {
    await waitFor(element(by.label(restaurantName)))
      .toBeVisible()
      .whileElement(by.id('restaurantList'))
      .scroll(120, 'down');
  }
  await element(by.label(restaurantName)).tap();
  return element(by.label(restaurantName));
};

export const addProduct = async testID => {
  console.log(`Adding product with testID "${testID}"`);
  try {
    await expect(element(by.id(testID))).toBeVisible();
  } catch (e) {
    await waitToBeVisible(testID, 0)
      .whileElement(by.id('restaurantData'))
      .scroll(200, 'down');
  }

  await tapById(testID);

  try {
    // Product details page
    await waitToBeVisible('productDetails');
  } catch (e) {
    //FIXME: it seems that sometimes the tap does not work on the first try
    await tapById(testID);
  }

  // FIXME: with a local coopcycle-web instance, we'll have more control over the test data
  // As there is no way to know the number of sections,
  // we try with 10 sections
  for (let section = 0; section < 10; section++) {
    try {
      await tapById(`productOptions:${section}:0`);
    } catch (e) {
      // ignore errors if a section does not have any option
    }
  }

  return await tapById('addProduct');
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

  await typeTextQuick(cardNumberElement(), '4242424242424242');
  await typeTextQuick(expirationDateElement(), '1228');
  // Add "\n" to make sure keyboard is hidden
  await typeTextQuick(cvvElement(), '123\n');

  return cardNumberElement();
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
  await waitToBeVisible(elemId);

  //await element(by.id(elemId)).typeText(address);
  await typeTextQuick(elemId, address);
  // Sometimes the app hangs waiting for:
  //   The app is busy with the following tasks:
  //    • "LooperIdlingResource-2828-mqt_js" (JS Thread) is executing (JavaScript code).

  //await tapById(`placeId:${placeId}`);
  // The line above was disabled because somehow it doesn't like `toBeVisible()`
  await element(by.id(`placeId:${placeId}`)).tap();
  return element(by.id(`placeId:${placeId}`));
};

// Improved version of `typeText`
export const typeTextQuick = async (elemIdOrObj, text) => {
  const elem = () => typeof elemIdOrObj === 'string' ? element(by.id(elemIdOrObj)) : elemIdOrObj;

  if (text.length > 1) {
    await elem().replaceText(text.slice(0, -1));
    text = text.slice(-1);
  }

  // Just type the last character
  await elem().typeText(text);
  return elem();
};

export const tapById = async (testID, timeout = 0) => {
  await waitToBeVisible(testID, timeout);
  await element(by.id(testID)).tap();
  return element(by.id(testID));
};

export const tapByText = async (text) => {
  await waitFor(element(by.text(text))).toBeVisible();
  await element(by.text(text)).tap();
  return element(by.text(text));
};

export const swipeRight = async (testID, timeout = 0) => {
  await waitToBeVisible(testID, timeout);
  await element(by.id(testID)).swipe('right');
  return element(by.id(testID));
};

export const swipeLeft = async (testID, timeout = 0) => {
  await waitToBeVisible(testID, timeout);
  await element(by.id(testID)).swipe('left');
  return element(by.id(testID));
};

export const waitToBeVisible = (testID, timeout = 5000) => {
  console.log(`Waiting for element with testID "${testID}" to be visible${timeout ? ` for ${timeout}ms` : ''}..`);
  const elem = waitFor(element(by.id(testID))).toBeVisible();
  return timeout ? elem.withTimeout(timeout) : elem;
};

export const waitToExist = (testID, timeout = 5000) => {
  console.log(`Waiting for element with testID "${testID}" to exist${timeout ? ` for ${timeout}ms` : ''}..`);
  const elem = waitFor(element(by.id(testID))).toExist();
  return timeout ? elem.withTimeout(timeout) : elem;
};

export const sleep = (timeout) => {
  console.log(`Sleeping for ${timeout} ms..`);
  return new Promise(resolve => setTimeout(resolve, timeout));
};
