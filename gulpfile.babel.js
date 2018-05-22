import gulp from 'gulp';
import git from 'gulp-git';
import { files, testStatus, unit, intg, e2e } from './gulp.jest.babel.js';
import bump from 'gulp-bump';
import { webpackHash,
  webpackTask, pugTask, build } from './gulp.build.babel.js';
import { getChangedFilesForRoots } from 'jest-changed-files';
import { promisify } from './promisify.js';

git.pr = {
  checkout: promisify(git.checkout)
}

const { bumpV, branch, npm_package_version: npmv } = process.env;

let numChangedFiles = 0;

const commit = () => {
  let stream = gulp.src('.');

  stream
    .pipe(git.add());

  if (bumpV !== null && bumpV !== undefined) {
    stream
      .pipe(bump({ type: bumpV }));
  }

  stream
    .pipe(git.commit(() => `V = ${npmv}`));

  return stream;
};

const mergeStaging = () => {
  return git.pr.checkout('staging')
    .then(() => git.merge('development'))
}

const checkBranch = () => {
    git.revParse({
      args: '--abbrev-ref HEAD'
    }, function (err, branch) {
      console.log('currently: ', branch);
    });
};

const checkoutBranch = () => {
  git.revParse({
    args: '--abbrev-ref HEAD'
  }, function (err, branch) {
    if (err) { throw err };
    if (branch !== undefined && branch !== branch) {
      git.checkout(branch, function (err) {
        if (err) { throw err; }
      })
    }
  })
};

const diff = () => {
  return getChangedFilesForRoots(['./'])
    .then(changes => {
      let changedFiles = Array.from(changes.changedFiles)
        .filter(file => !/\.test\.js/.test(file))
      numChangedFiles = changedFiles.length;
    });
}

const watch = () => {
  let watcher = gulp.watch(['src/scripts/*.js', '!src/scripts/*.*.test.js']);
  watcher.on('change', (path, stats) => {
    console.log(`File ${path} changed`);
    const rgx = /\.js$/,
      testExt = '.(unit|intg).test.js';
    jest(path.replace(rgx, testExt).replace('src/scripts/', '**/'));
  });
};

const bumpVersion = () => {
  let stream = gulp.src('./package.json');

  if (testStatus) {
    stream
      .pipe(bump({ type: bumpV || "patch" }))
      .pipe(gulp.dest('./'));
  }

  return stream;
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
