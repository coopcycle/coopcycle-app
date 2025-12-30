import {
  authenticateWithCredentials,
  loadFixturesAndConnect,
} from "../support/commands";

export async function loadStoreFixture() {
  await loadFixturesAndConnect('store_basic.yml', true);
}

export async function loginStoreUser() {
  await authenticateWithCredentials('store_1', 'store_1');
}
