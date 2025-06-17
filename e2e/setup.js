import { disablePasswordAutofill, launchApp } from './support/commands';

beforeAll(async () => {
  disablePasswordAutofill();
});

beforeEach(async () => {
  await launchApp();
});
