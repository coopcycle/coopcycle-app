import { disablePasswordAutofill, launchApp } from './support/commands';

beforeAll(async () => {
  await launchApp();
  disablePasswordAutofill();
});
