const jest = require('jest/node_modules/jest-cli/build/cli');

function runJest (test) {
  let thing = jest.runCLI({
    notify: true,
    version: false,
    coverage: true,
    testMatch: test !== undefined ? [test] : ['**/__tests__/**/*.js?(x)', '**/?(*.)(spec|test).js?(x)']
    // testRegex: [test || null]
  }, ["./"]);

  return thing;
}

module.exports = runJest;
