import moment from 'moment';

import {
  describeif,
  loadFixturesAndConnect,
  tapById,
  typeTextQuick,
  waitToBeVisible,
} from './support/commands';

//FIXME: run these tests for iOS too (requires a local coopcycle-web instance)
describeif(device.getPlatform() === 'android')
  ('Registration', () => {

  beforeEach(async () => {
    // The fixture isn't really needed/used
    await loadFixturesAndConnect('checkout.yml');
  });

  it('should be able to register', async () => {
    await tapById('menuBtn');
    await tapById('drawerAccountBtn');

    await waitToBeVisible('loginOrRegister');
    await tapById('loginOrRegister');

    const timestamp = moment().format('X');

    await typeTextQuick('registerForm.email', `dev+${timestamp}@coopcycle.org\n`);
    await typeTextQuick('registerForm.username', `dev${timestamp}\n`);
    await typeTextQuick('registerForm.password', '12345678\n');
    await typeTextQuick('registerForm.passwordConfirmation', '12345678\n');
    await typeTextQuick('registerForm.givenName', 'John\n');
    await typeTextQuick('registerForm.familyName', 'Doe\n');

    await tapById('registerForm.legal');
    await tapById('submitRegister');

    await expect(element(by.text(`Hello dev${timestamp}`))).toBeVisible();
  });
});
