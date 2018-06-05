import gulp from 'gulp';
import git from 'gulp-git';
import { getChangedFilesForRoots } from 'jest-changed-files';
import { promisify } from './promisify.js';
import { gitCz } from 'commitizen/dist/cli/strategies';
import { configLoader } from 'commitizen';

const { branch } = process.env;

git.pr = {
  checkout: promisify(git.checkout),
  merge: promisify(git.merge)
}

export let numChangedFiles = 0;

export const add = () => {
  return gulp.src('.')
    .pipe(git.add());
}

export const commit = gulp.series(add, async () => await gitCz([], {
  cliPath: __dirname,
}, configLoader.load()));

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
