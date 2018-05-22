import gulp from 'gulp';
import git from 'gulp-git';
import { files, testStatus,
  unit, intg, unit_intg, e2e } from './gulp.jest.babel.js';
import bump from 'gulp-bump';
import { webpackHash,
  webpackTask, pugTask, build } from './gulp.build.babel.js';
<<<<<<< HEAD
<<<<<<< HEAD
// import { getChangedFilesForRoots } from 'jest-changed-files';
// import { promisify } from './promisify.js';
=======
>>>>>>> dev
import { numChangedFiles, commit, mergeStaging } from './gulp.git.babel.js';

const { bumpV, branch, npm_package_version: npmv } = process.env;

=======
import { getChangedFilesForRoots } from 'jest-changed-files';
import { promisify } from './promisify.js';

git.pr = {
  checkout: promisify(git.checkout),
  merge: promisify(git.merge)
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
    .then(() => git.pr.merge('dev'))
    .then(() => git.pr.checkout('dev'));
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

>>>>>>> b2a5341... [patch] - V: undefined
const watch = () => {
  let watcher = gulp.watch(['src/scripts/*.js', '!src/scripts/*.*.test.js']);
  watcher.on('change', (path, stats) => {
    console.log(`File ${path} changed`);
    const rgx = /\.js$/,
      testExt = '.(unit|intg).test.js';
    jest(path.replace(rgx, testExt).replace('src/scripts/', '**/'));
  });
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
const bumpVersion = () => {
  let stream = gulp.src('./package.json');

  if (testStatus) {
    stream
      .pipe(bump({ type: bumpV || "patch" }))
      .pipe(gulp.dest('./'));
  }

  return stream;
};

>>>>>>> b2a5341... [patch] - V: undefined
const checkin = gulp.series(commit, unit, intg);
=======
const checkin = gulp.series(commit, unit_intg);
>>>>>>> dev
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
