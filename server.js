const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

const hook = compiler.hooks.beforeCompile;
console.log(hook, hook.tap, hook.tapAsync, hook.tapPromise);

hook.tap("Before compile", () => console.log(arguments));

compiler.run((err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err);
  } else {
    console.log(stats);
  }
});
