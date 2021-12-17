const jestBaseConfig = require('./jest-base');

module.exports = {
  ...jestBaseConfig,
  name: 'e2e',
  displayName: 'e2e',
  setupFilesAfterEnv: [
    '<rootDir>/mongo-test-setup.ts',
    // can have more setup files here
  ],
};
