import gulp from 'gulp';
import git from 'gulp-git';
import { files, testStatus, unit, intg, e2e } from './gulp.jest.babel.js';
import bump from 'gulp-bump';
import { webpackHash,
  webpackTask, pugTask, build } from './gulp.build.babel.js';
// import { getChangedFilesForRoots } from 'jest-changed-files';
// import { promisify } from './promisify.js';
import { numChangedFiles, commit, mergeStaging } from './gulp.git.babel.js';

// git.pr = {
//   checkout: promisify(git.checkout),
//   merge: promisify(git.merge)
// }

const { bumpV, branch, npm_package_version: npmv } = process.env;

const watch = () => {
  let watcher = gulp.watch(['src/scripts/*.js', '!src/scripts/*.*.test.js']);
  watcher.on('change', (path, stats) => {
    console.log(`File ${path} changed`);
    const rgx = /\.js$/,
      testExt = '.(unit|intg).test.js';
    jest(path.replace(rgx, testExt).replace('src/scripts/', '**/'));
  });
};

const checkin = gulp.series(commit, unit, intg);
const checkinDev = gulp.parallel(checkin, build);
const checkinStaging = gulp.series(checkinDev, e2e, mergeStaging);
// const staging = gulp.series()

export {
  unit,
  intg,
  e2e,
  watch,
  webpackTask,
  pugTask,
  checkin,
  build,
  checkinStaging as default
}
