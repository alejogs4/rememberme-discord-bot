const jestBaseConfig = require('./jest-base');

module.exports = {
  ...jestBaseConfig,
  name: 'unit',
  displayName: 'unit',
  testPathIgnorePatterns: [...jestBaseConfig.testPathIgnorePatterns, '<rootDir>/src/e2e/'],
};
