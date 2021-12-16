module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
  setupFiles: ['<rootDir>auto-mock.config.ts'],
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
};
