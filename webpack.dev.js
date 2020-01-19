const webpack = require('webpack');
const merge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const common = require('./webpack.common.js');

const smp = new SpeedMeasurePlugin();

const webpackConfig = smp.wrap(merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new SpeedMeasurePlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
  ],
  optimization: {
    minimize: false,
  },
}));

module.exports = webpackConfig;
