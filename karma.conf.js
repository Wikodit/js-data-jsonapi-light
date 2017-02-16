const webpackConfig = require('./webpack.config');
const path = require('path')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'node_modules/js-data/dist/js-data.js',
      'node_modules/js-data-http/dist/js-data-http.js',
      'dist/js-data-jsonapi-light.js',
      'test/**/*.spec.ts',
      { pattern: 'test/api/**/*.json', watched: true, served: true, included: false }
    ],
    proxies: {
      "/api/": "/base/test/api/"
    },
    exclude: [
    ],
    preprocessors: {
      'test/**/*.ts': ['webpack', 'sourcemap']
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
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    client: { captureConsole: true }
  })
}