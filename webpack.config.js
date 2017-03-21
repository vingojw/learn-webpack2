var path = require('path');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: '[chunkhash].[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};