import gulp from 'gulp';
import git from 'gulp-git';
import bump from 'gulp-bump';
import { getChangedFilesForRoots } from 'jest-changed-files';
import { promisify } from './promisify.js';
import { gitCz } from 'commitizen/dist/cli/strategies';
import { configLoader } from 'commitizen';

const { bumpV, branch, npm_package_version: npmv } = process.env;

git.pr = {
  checkout: promisify(git.checkout),
  merge: promisify(git.merge)
}

export let numChangedFiles = 0;

export const commitMessage = (args, i) =>
(i = args.findIndex(el => el === "--m")) >  -1 ?
args[i+1] : "placeholder";

export const commitSemVer = (args, t) =>
(t = args.findIndex(el => el === "--bump")) > -1 ?
args[t+1] : "bump";

const bumpFactory = type => () =>
  gulp.src('./package.json')
    .pipe(bump({ type }))
    .pipe(gulp.dest('./'));

export const bumpDev = bumpFactory('prerelease');
export const bumpStaging = bumpFactory(commitSemVer(process.argv));

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

const bumpVersion = () => {
  let stream = gulp.src('./package.json');

  if (testStatus) {
    stream
      .pipe(bump({ type: bumpV || "patch" }))
      .pipe(gulp.dest('./'));
  }

  return stream;
};
