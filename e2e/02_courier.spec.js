import {
  authenticateWithCredentials,
  connectToTestInstance,
  symfonyConsole,
} from './utils';

const execSync = require('child_process').execSync;

describe('Courier', () => {
  beforeEach(async () => {
    symfonyConsole('coopcycle:fixtures:load -f cypress/fixtures/courier.yml');

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
    await device.reloadReactNative();
    await connectToTestInstance();
  });

  it(`should be able to login and see tasks`, async () => {
    await authenticateWithCredentials('jane', '12345678');

    if (device.getPlatform() === 'android') {
      // dismiss BACKGROUND_PERMISSION_DISCLOSURE alert
      await element(by.text('CLOSE')).tap();
    }

    await expect(element(by.id('messengerTabMap'))).toBeVisible();
    await expect(element(by.id('messengerTabList'))).toBeVisible();

    await element(by.id('messengerTabList')).tap();

    await expect(element(by.id('task:0'))).toBeVisible();
    await expect(element(by.id('task:1'))).toBeVisible();
  });
});
