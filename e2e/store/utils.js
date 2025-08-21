import {
  authenticateWithCredentials,
  loadFixturesAndConnect,
} from "../support/commands";

export async function loadStoreFixture() {
  await loadFixturesAndConnect('stores.yml');
}

export async function loginStoreUser() {
  await authenticateWithCredentials('store_1', 'store_1');
}
