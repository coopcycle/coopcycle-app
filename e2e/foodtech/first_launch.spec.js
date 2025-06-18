import {
  connectToLocalInstance,
  connectToSandbox,
  symfonyConsole,
} from '../support/commands';

describe('Foodtech - first launch', () => {
  it(`should show AskAddress screen`, async () => {
    if (device.getPlatform() === 'android') {
      symfonyConsole(
        'coopcycle:fixtures:load -f cypress/fixtures/checkout.yml',
      );
      await connectToLocalInstance();
    } else {
      //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
      await connectToSandbox();
    }

    await device.takeScreenshot('AskAddress screen');

    await expect(element(by.id('checkoutAskAddress'))).toBeVisible();
  });
});
