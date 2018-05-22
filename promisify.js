const fs = require("fs");

const promisify = fn => {
  let thisargs = arguments;
  return function () {
    return new Promise((resolve, reject) => {
      fn(...arguments, (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      })
    });
  }
}

module.exports = {
  promisify,
  pr: {
    readdir: promisify(fs.readdir),
    readFile: promisify(fs.readFile),
    writeFile: promisify(fs.writeFile)
  }
}
