import gulp from 'gulp';
import git from 'gulp-git';
import bump from 'gulp-bump';
import { getChangedFilesForRoots } from 'jest-changed-files';
import { promisify } from './promisify.js';

const { bumpV, branch, npm_package_version: npmv } = process.env;

git.pr = {
  checkout: promisify(git.checkout),
  merge: promisify(git.merge)
}

export let numChangedFiles = 0;

export const commit = () => {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('placeholder message'));
};

export const mergeStaging = () => {
  return git.pr.checkout('staging')
    .then(() => git.pr.merge('dev'))
    .then(() => git.pr.checkout('dev'));
}

const diff = () => {
  return getChangedFilesForRoots(['./'])
    .then(changes => {
      let changedFiles = Array.from(changes.changedFiles)
        .filter(file => !/\.test\.js/.test(file))
      numChangedFiles = changedFiles.length;
    });
}

const bumpVersion = () => {
  let stream = gulp.src('./package.json');

  if (testStatus) {
    stream
      .pipe(bump({ type: bumpV || "patch" }))
      .pipe(gulp.dest('./'));
  }

  return stream;
};
