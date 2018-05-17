const { findRepos, getChangedFilesForRoots } = require("jest-changed-files");
const path = require('path');

let roots = ['.'].map(f => {
  return path.resolve(__dirname, f);
});

let changes = getChangedFilesForRoots(['./'])
  .then(changes => console.log(changes))
  .catch(err => console.error(`Error: ${err}`));
