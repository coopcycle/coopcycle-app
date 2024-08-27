import {
  authenticateWithCredentials,
  connectToTestInstance,
  disablePasswordAutofill,
  itif,
  symfonyConsole,
} from './utils';

describe('Courier', () => {
  beforeEach(async () => {
    symfonyConsole('coopcycle:fixtures:load -f cypress/fixtures/courier.yml');

    disablePasswordAutofill();

    await device.reloadReactNative();
    await connectToTestInstance();
  });

  //FIXME: run this test for iOS too (requires a local coopcycle-web instance)
  itif(device.getPlatform() === 'android')(
    `should be able to login and see tasks`,
    async () => {
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
    },
  );
});
