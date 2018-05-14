const gulp = require('gulp');
const git = require('gulp-git');
const jest = require('./trial');

let testStatus = undefined;
let files = undefined;

gulp.task('default', ['jest'], function() {
  let stream = gulp.src('.');

  if (testStatus) {
    stream
      .pipe(git.add())
      .pipe(git.commit(`[prerelease] - V: ${process.env.npm_package_version}`));
  }

  return stream;
});

gulp.task('jest', function() {
  let stream = jest();

  stream.then(({results: {testResults, success}}) => {
    const rgx = /\.test\.js$/;
    files = testResults.map(el => {
      return el.testFilePath.replace(rgx, '.js');
    });

    testStatus = success;
  });

  return stream;
});
