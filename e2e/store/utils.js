import {
  authenticateWithCredentials,
  loadFixturesAndConnect,
} from '../support/commands';

export async function loadStoreFixture() {
  await loadFixturesAndConnect([
    'setup_default.yml',
    'user_dispatcher.yml',
    'store_basic.yml',
  ]);
}

export async function loginStoreUser() {
  await authenticateWithCredentials('store_1', 'store_1');
}
