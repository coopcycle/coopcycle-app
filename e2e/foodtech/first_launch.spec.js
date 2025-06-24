import {
  waitToBeVisible,
} from '../support/commands';
import {
  loadCheckoutFixturesAndConnect,
} from './utils';

describe('Foodtech - first launch', () => {
  it(`should show AskAddress screen`, async () => {
    await loadCheckoutFixturesAndConnect();

    await device.takeScreenshot('AskAddress screen');

    await waitToBeVisible('checkoutAskAddress');
  });
});
