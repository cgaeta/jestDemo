import gulp from 'gulp';
import jest from './trial';
import { pr } from './promisify.js';

export let files;
export let testStatus;

const color = p => {
  switch (Math.floor(p/10)) {
    case 10:
      return "brightgreen";
    case 9:
      return "green";
    case 8:
      return "yellowgreen";
    case 7:
    case 6:
      return "yellow";
    case 5:
      return "orange";
    default:
      return "red";
  }
}

const updateReadme = pass => {
  Promise.all([
    pr.readFile('./coverage/unit/coverage-summary.json', "utf-8"),
    pr.readFile('./README.md', "utf-8")
  ])
  .then(([res, readme]) => {
    let pct = JSON.parse(res).total.statements.pct;
    let cvg = /badge\/Coverage-\d+\%-\w+/;

    let update = readme.replace(cvg, () =>
      `badge/Coverage-${pct}%25-${color(pct)}`);

    let bld = /badge\/Build-\w+-\w+/;
    update = update.replace(bld, () =>
      `badge/Build-${pass?`Passed`:`Failed`}-${pass?`brightgreen`:`red`}`);

     pr.writeFile("./README.md", update);
  });
}

const jestFactory = (test, dir) => () => {
  let t = `**/?(*.)${test}.test.js?(x)`;
  let d = dir || `./coverage/${test}`;

  return jest(t, d)
  .then(({results: {testResults, success}}) => {

    const rgx = /\.test\.js$/;
    files = testResults.map(el => {
      return el.testFilePath.replace(rgx, '.js');
    });

    testStatus = success;
    if (!success) {
      console.error("Warning: Test(s) did not pass!");
    }

    return success;
  })
  .then(updateReadme);
};

export const unit = jestFactory('unit');
export const intg = jestFactory('intg');
export const unit_intg = jestFactory('unit|intg', './coverage/intg/');
export const e2e = jestFactory('e2e');

gulp.task('Unit test', unit);
gulp.task('Integration test', intg);
gulp.task('End to End test', e2e);
