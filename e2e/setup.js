import { disablePasswordAutofill, launchApp } from './support/commands';

beforeAll(() => {
  disablePasswordAutofill();
});

beforeEach(async () => {
  await launchApp();
});
