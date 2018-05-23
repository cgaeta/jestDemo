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
    .pipe(git.commit(commitMessage(process.argv)))
    .pipe(bump({type: 'prerelease'}));
};

export const mergeStaging = () => {
  return gulp.pipe(git.pr.checkout('staging'))
    .pipe(git.pr.merge('dev'))
    .pipe(bump({type: commitSemVer(process.argv)}))
    .pipe(git.pr.checkout('dev'));
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

export const commitMessage = (args, i) =>
  (i = args.findIndex(el => el === "--m")) >  -1 ?
    args[i+1] : "placeholder";

export const commitSemVer = (args, t) =>
  (t = args.findIndex(el => el === "--bump")) > -1 ?
    args[t+1] : "bump";
