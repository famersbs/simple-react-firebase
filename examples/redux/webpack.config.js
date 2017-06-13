//var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var isProd = process.env.NODE_ENV === 'production';

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: isProd ? './index.js' : [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.resolve(__dirname,'./public'),
    historyApiFallback: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [/node_modules/],
        use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['stage-1', 'es2015', 'react'],
                plugins: [require('babel-plugin-transform-decorators-legacy').default],
              }
            },
        ]
      }
    ]
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ]
  },
  devtool: "source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};
