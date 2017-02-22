const webpackConfig = require('./webpack.config');
const path = require('path')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'node_modules/es6-promise/dist/es6-promise.auto.js',
      { pattern: 'node_modules/js-data/dist/js-data.js', nocache: true, watched: true, served: true},
      'node_modules/js-data-http/dist/js-data-http.js',
      'dist/js-data-jsonapi-light.js',
      'test/ds.ts',
      'test/resources/**/*.ts',
      'test/**/*.spec.ts',
      { pattern: 'test/api/**/*.json', watched: true, served: true, included: false }
    ],
    proxies: {
      "/api/": "/base/test/api/"
    },
    exclude: [
    ],
    preprocessors: {
      'test/**/*.ts': ['webpack', 'sourcemap'],
      'dist/js-data-jsonapi-light.js': ['coverage']
    },
    webpack: {
      module: {
        rules: [{
          test: /\.ts$/,
          include: path.resolve(__dirname, 'test'),
          use: [
            { loader: 'ts-loader' }
          ]
        }]
      },
      resolve: webpackConfig.resolve,
      devtool: "inline-source-map"
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: process.env.NODE_ENV !== 'development',
    concurrency: Infinity,
    // client: { captureConsole: process.env.NODE_ENV === 'development' }
  })
}