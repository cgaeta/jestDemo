import gulp from 'gulp';
import git from 'gulp-git';
import { files, testStatus,
  unit, intg, unit_intg, e2e } from './gulp.jest.babel.js';
import { webpackHash,
  webpackTask, pugTask, build } from './gulp.build.babel.js';
import {
  commit,
  mergeStaging,
  commitMessage,
  commitSemVer
} from './gulp.git.babel.js';

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

const checkin = gulp.series(commit, unit_intg);
const checkinDev = gulp.parallel(checkin, build);
const checkinStaging = gulp.series(checkinDev, e2e, mergeStaging);

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
