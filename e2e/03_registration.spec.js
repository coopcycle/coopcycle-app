import moment from 'moment';

import {
  connectToLocalInstance,
  connectToSandbox,
  symfonyConsole,
} from './support/commands';

describe.skip('Registration', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should be able to register', async () => {
    if (device.getPlatform() === 'android') {
      // symfonyConsole(
      //   'coopcycle:fixtures:load -f cypress/fixtures/checkout.yml',
      // );
      await connectToLocalInstance();
    } else {
      //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
      await connectToSandbox();
    }

    await expect(element(by.id('menuBtn'))).toBeVisible();
    await element(by.id('menuBtn')).tap();
    await element(by.id('drawerAccountBtn')).tap();

    await expect(element(by.id('loginOrRegister'))).toBeVisible();
    await element(by.id('loginOrRegister')).tap();

    const timestamp = moment().format('X');

    await element(by.id('registerForm.email')).typeText(
      `dev+${timestamp}@coopcycle.org\n`,
    );
    await element(by.id('registerForm.username')).typeText(`dev${timestamp}\n`);
    // https://github.com/wix/detox/issues/916
    await element(by.id('registerForm.password')).replaceText('12345678\n');
    await element(by.id('registerForm.passwordConfirmation')).replaceText(
      '12345678\n',
    );

    await element(by.id('registerForm.givenName')).typeText('John\n');
    await element(by.id('registerForm.familyName')).typeText('Doe\n');

    // As we are using "\n", the form may have been submitted yet
    try {
      await element(by.id('submitRegister')).tap();
    } catch (e) {}

    await expect(element(by.id('registerCheckEmail'))).toBeVisible();
  });
});
