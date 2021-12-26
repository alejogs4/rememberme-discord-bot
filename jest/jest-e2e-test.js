const jestBaseConfig = require('./jest-base');

module.exports = {
  ...jestBaseConfig,
  name: 'e2e',
  displayName: 'e2e',
  setupFilesAfterEnv: ['<rootDir>/mongo-tests-setup.ts'],
};
