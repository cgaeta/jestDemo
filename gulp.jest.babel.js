import gulp from 'gulp';
import jest from './trial';

export let files;
export let testStatus;

const jestFactory = (test, dir) => () => {

  let stream = jest(test, dir);

  stream.then(({results: {testResults, success}}) => {
    const rgx = /\.test\.js$/;
    files = testResults.map(el => {
      return el.testFilePath.replace(rgx, '.js');
    });

    testStatus = success;
    if (!success) {
      throw new Error ('Failed a test');
    }
  });

  return stream;
};

export const unit = jestFactory('**/?(*.)unit.test.js?(x)', './coverage/unit/');
export const intg = jestFactory('**/?(*.)intg.test.js?(x)', './coverage/intg/');
export const unit_intg = jestFactory('**/?(*.)(unit|intg).test.js?(x)',
  './coverage/intg/');
export const e2e = jestFactory('**/?(*.)acpt.test.js?(x)', './coverage/e2e/');

gulp.task('Unit test', unit);
gulp.task('Integration test', intg);
gulp.task('End to End test', e2e);
