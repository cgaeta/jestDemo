const jest = require('jest/node_modules/jest-cli/build/cli');

function runJest (rootDir) {
  let thing = jest.runCLI({
    notify: true,
    version: false,
    outputFile: "testResults.json",
    // json: true,
    coverage: true
  }, [rootDir || "./"]);
  // }, ["./"]).then(({results: {success}}) => console.log(success));

  return thing;
}

module.exports = runJest;
