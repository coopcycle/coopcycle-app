import {
  authenticateWithCredentials,
  connectToTestInstance,
  disablePasswordAutofill,
  symfonyConsole,
} from './utils';

//FIXME; this test requires a local coopcycle-web instance, which is problematic to setup on CI (see testOnDevice.yml)
describe.skip('Courier', () => {
  beforeEach(async () => {
    symfonyConsole('coopcycle:fixtures:load -f cypress/fixtures/courier.yml');

    disablePasswordAutofill();

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
