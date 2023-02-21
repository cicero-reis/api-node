/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  collectCoverage: true,
  testTimeout: 10000,
  collectCoverageFrom: [
    '**/models/**/*.js',
    '**/http/**/*.js',
    '**/utils/**/*.js',
    '**/routes/**/*.js',
    '**/error/**/*.js',
    '**/redis/**/*.js',
    '**/mail/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
}
