import gulp from 'gulp';
import git from 'gulp-git';
import jest from './trial';
import bump from 'gulp-bump';
import gulpWebpack from 'webpack-stream';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import pug from 'pug';
import { getChangedFilesForRoots } from 'jest-changed-files';
import fs from 'fs';

const promisify = fn => {
  let thisargs = arguments;
  return function () {
    return new Promise((resolve, reject) => {
      fn(...arguments, (err, data) => {
        if (err) { throw err; }
        resolve(data);
      })
    });
  }
}

fs.readdir.async = promisify(fs.readdir);
fs.readFile.async = promisify(fs.readFile);
fs.writeFile.async = promisify(fs.writeFile);

const { bumpV, branch, npm_package_version } = process.env;

const pageDir = './src/pages/';

let testStatus = undefined;
let files = undefined;
var webpackHash = undefined;
let numChangedFiles = 0;

const commit = () => {
  let stream = gulp.src('.');

  if (testStatus && numChangedFiles > 0) {
    stream
      .pipe(git.add())
      .pipe(git.commit(`[${bumpV || "patch"}] - V: ${npm_package_version}`));
  }

  return stream;
};

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

const webpackTask = () => {
  return gulp.src('src/index.js')
    .pipe(gulpWebpack(webpackConfig, webpack, (err, stats) => {
      // console.log(stats.hash);
      // console.log(Array.from(stats.compilation.fileDependencies.values()));
      webpackHash = stats.hash;
    }))
    .pipe(gulp.dest('dist/'));
};

const pugTask = () => {
  return fs.readdir.async(pageDir)
    .then(files => files.forEach(f => {
      let srcpath = pageDir + f,
        tgtpath = `./dist/${f.replace('.pug', '.html')}`;
      fs.readFile.async(srcpath, "utf-8")
        .then(src =>
          fs.writeFile.async(tgtpath, pug.render(src, {
            jsHash: webpackHash
          }))
        )
    }));
};

const testFn = () => {
  return gulp.src('src/scripts/*.js', { since: gulp.lastRun(testFn) })
    .pipe(console.log(arguments));
};

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

const jestTask = () => {
  let stream = jest();

  stream.then(({results: {testResults, success}}) => {
    const rgx = /\.test\.js$/;
    files = testResults.map(el => {
      return el.testFilePath.replace(rgx, '.js');
    });

    testStatus = success;
  });

  return stream;
};

const build = gulp.series(webpackTask, pugTask);
const checkin = gulp.series(jestTask, diff, commit);

exports.jest = jestTask;
exports.watch = watch;
exports.webpack = webpackTask;
exports.checkBranch = checkBranch;
exports.pug = pugTask;
exports.diff = diff;
exports.commit = commit;
exports.checkin = checkin;
exports.default = build;
