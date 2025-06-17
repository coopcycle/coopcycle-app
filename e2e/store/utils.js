import {
  authenticateWithCredentials,
  connectToLocalInstance,
  connectToSandbox,
  symfonyConsole
} from "../support/commands";

export async function loadStoreFixture() {
  if (device.getPlatform() === 'android') {
    symfonyConsole(
      'coopcycle:fixtures:load -f cypress/fixtures/stores.yml',
    );
    await connectToLocalInstance();
  } else {
    //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
    await connectToSandbox();
  }
}

export async function doLoginForUserWithRoleStore() {
  await authenticateWithCredentials('store_1', 'store_1');
}
