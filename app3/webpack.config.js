const HtmlWebpackPlugin = require('html-webpack-plugin');
const PACKAGE = require('./package.json');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');
const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, 'src/index'),
  },
    output: {
    filename: '[name].[contenthash].js', // named after one of the entry keys (contenthash is for caching)
    publicPath: 'auto',
  },
  mode: mode,
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3003,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app3',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button', // to expose certain components
        // './App': './src/index', // to expose the whole App
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: PACKAGE.dependencies.react },
        "react-dom": { singleton: true, eager: true, requiredVersion: PACKAGE.dependencies["react-dom"] }
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
