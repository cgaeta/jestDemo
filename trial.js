const jest = require('jest/node_modules/jest-cli/build/cli');

function runJest (rootDir) {
  let thing = jest.runCLI({
    notify: true,
    version: false,
    coverage: true
  }, [rootDir || "./"]);

  return thing;
}

module.exports = runJest;
