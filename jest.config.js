/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const unitTestProject = require('./jest/jest-unit-test');
const e2eTestProject = require('./jest/jest-e2e-test');

module.exports = {
  projects: [unitTestProject, e2eTestProject],
};
