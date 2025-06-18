import {
  authenticateWithCredentials,
  connectToLocalInstance,
  describeif,
  symfonyConsole,
} from './support/commands';

//FIXME: run these tests for iOS too (requires a local coopcycle-web instance)
describeif(device.getPlatform() === 'android')('Courier', () => {
  beforeEach(async () => {
    symfonyConsole('coopcycle:fixtures:load -f cypress/fixtures/courier.yml');

    await connectToLocalInstance();
  });

  it(`should be able to login and see tasks`, async () => {
    await authenticateWithCredentials('jane', '12345678');

    if (device.getPlatform() === 'android') {
      try {
        // dismiss BACKGROUND_PERMISSION_DISCLOSURE alert
        await element(by.text("I accept")).tap();
      } catch {}

      try {
        // dismiss HMS Core alert
        await element(by.text('OK')).tap();
      } catch {}
    }

    await expect(element(by.id('messengerTabMap'))).toBeVisible();
    await expect(element(by.id('messengerTabList'))).toBeVisible();

    await element(by.id('messengerTabList')).tap();

    await expect(element(by.id('courierTaskList:task:0'))).toBeVisible();
    await expect(element(by.id('courierTaskList:task:1'))).toBeVisible();
  });
});
