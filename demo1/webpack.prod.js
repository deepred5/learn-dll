const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const prodConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: false,
            importLoaders: 2
          }
        },
          'sass-loader',
          'postcss-loader'
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css',
    }),
    new AddAssetHtmlPlugin({ filepath: path.resolve(__dirname, './dll/*.dll.js') }), // 把dll.js加进index.html里，并且拷贝文件到dist目录
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css',
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, './dll/vendors.manifest.json') // 读取dll打包后的manifest.json，分析哪些代码跳过
    }),
    new CleanWebpackPlugin(),
    new ManifestPlugin()
  ]
};

module.exports = merge(baseConfig, prodConfig);