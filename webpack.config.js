const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js-data-jsonapi-light.js',
    library: 'JSDataJsonApiLight',
    libraryTarget: 'umd'
  },
  externals: {
    'js-data': {
      amd: 'js-data',
      commonjs: 'js-data',
      commonjs2: 'js-data',
      root: 'JSData'
    },
    'js-data-http': {
      amd: 'js-data-http',
      commonjs: 'js-data-http',
      commonjs2: 'js-data-http',
      root: 'JSDataHttp'
    }
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: path.resolve(__dirname, 'src'),
      use: [
        { loader: 'ts-loader' }
      ]
    }]
  }
}