import {
  authenticateWithCredentials,
  describeif,
  loadFixturesAndConnect,
  tapById,
  tapByText,
  waitToBeVisible,
} from '../support/commands';

//FIXME: run these tests for iOS too (requires a local coopcycle-web instance)
describeif(device.getPlatform() === 'android')
  ('Courier', () => {

  beforeEach(async () => {
    await loadFixturesAndConnect('courier.yml', true);
    await authenticateWithCredentials('jane', '12345678');
  });

  it(`should be able to login and see tasks`, async () => {
    if (device.getPlatform() === 'android') {
      try {
        // dismiss BACKGROUND_PERMISSION_DISCLOSURE alert
        await tapByText('I accept');
      } catch {}

      try {
        // dismiss HMS Core alert
        await tapByText('OK');
      } catch {}
    }

    await waitToBeVisible('messengerTabMap');
    await waitToBeVisible('messengerTabList');

    await tapById('messengerTabList');

    await waitToBeVisible('courierTaskList:task:0');
    await waitToBeVisible('courierTaskList:task:1');
  });
});
