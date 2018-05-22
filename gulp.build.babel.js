import gulp from 'gulp';
import gulpWebpack from 'webpack-stream';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import pug from 'pug';
import { pr } from './promisify.js';
import { files } from './gulp.jest.babel.js';

const pageDir = './src/pages/';
export let webpackHash;

export const webpackTask = () => {
  return gulp.src('src/index.js')
    .pipe(gulpWebpack(webpackConfig, webpack, (err, stats) => {
      webpackHash = stats.hash;
    }))
    .pipe(gulp.dest('dist/'));
};

export const pugTask = () => {
  return pr.readdir(pageDir)
    .then(files => files.forEach(f => {
      let srcpath = pageDir + f,
        tgtpath = `./dist/${f.replace('.pug', '.html')}`;
      pr.readFile(srcpath, "utf-8")
        .then(src =>
          pr.writeFile(tgtpath, pug.render(src, {
            jsHash: webpackHash
          }))
        )
    }));
};

gulp.task('webpack', webpackTask);
gulp.task('pug', pugTask);

export const build = gulp.series('webpack', 'pug');
