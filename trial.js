const jest = require('jest/node_modules/jest-cli/build/cli');

function runJest (test, coverageDirectory) {
  let thing = jest.runCLI({
    notify: true,
    version: false,
    coverage: true,
    coverageDirectory,
    collectCoverageFrom: [
      "!**/node_modules/**",
      "**/src/scripts/**",
      "!**/src/scripts/tests/**"
    ],
    coverageReporters: ["json", "json-summary", "text", "lcov"],
    showConfig: false,
    globalSetup: "<rootDir>/setup.js",
    globalTeardown: "<rootDir>/teardown.js",
    testEnvironment: "./puppeteer_environment.js",
    testMatch: test !== undefined ? [test] : [
      '**/__tests__/**/*.js?(x)',
      '**/?(*.)(spec|test).js?(x)'
    ]
    // testRegex: [test || null]
  }, ["./"]);

  return thing;
}

module.exports = runJest;

// runJest();
