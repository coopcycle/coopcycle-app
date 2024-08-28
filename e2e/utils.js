const execSync = require('child_process').execSync;
const os = require('os');

//Make sure to have the correct path to the coopcycle-web repository while running locally
export const COMMAND_PREFIX =
  'cd ../coopcycle-web-repo && docker compose exec -T php';

export const describeif = condition => (condition ? describe : describe.skip);
export const itif = condition => (condition ? it : it.skip);

export const symfonyConsole = command => {
  const prefix = COMMAND_PREFIX;
  let cmd = `bin/console ${command} --env="test"`;
  if (prefix) {
    cmd = `${prefix} ${cmd}`;
  }
  execSync(cmd);
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

export const connectToDemo = async () => {
  await expect(element(by.id('chooseCityBtn'))).toBeVisible();
  await element(by.id('chooseCityBtn')).tap();

  await expect(element(by.id('moreServerOptions'))).toBeVisible();
  await element(by.id('moreServerOptions')).tap();

  await element(by.id('customServerURL')).typeText('demo.coopcycle.org\n');

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

export const connectToLocalInstance = async () => {
  await expect(element(by.id('chooseCityBtn'))).toBeVisible();
  await element(by.id('chooseCityBtn')).tap();

  await expect(element(by.id('moreServerOptions'))).toBeVisible();
  await element(by.id('moreServerOptions')).tap();

  await element(by.id('customServerURL')).typeText(
    `${getLocalIpAddress()}:9080\n`,
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

  // Product details page
  await waitFor(element(by.id('productDetails')))
    .toBeVisible()
    .withTimeout(1000);

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
