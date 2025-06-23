/** @type {import('jest').Config} */
module.exports = {
  maxWorkers: 1,
  rootDir: '..',
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  setupFilesAfterEnv: ['<rootDir>/e2e/setup.js'],
  testTimeout: 180000,
  //testMatch: ['<rootDir>/e2e/**/*.spec.js'],
  // TODO/WIP: Just running 1 test..!
  testMatch: ['<rootDir>/e2e/dispatch/success__create_delivery.spec.js'],
  // transform: {
  //   "\\.tsx?$": "ts-jest"
  // },
  reporters: ['detox/runners/jest/reporter'],
  verbose: true,
};
