const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PACKAGE = require('./package.json');
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
    port: 3001,
    open: true,
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
      name: 'app1',
      remotes: {
        app2: 'app2@http://localhost:3002/remoteEntry.js',
        app3: 'app3@http://localhost:3003/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: PACKAGE.dependencies.react },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: PACKAGE.dependencies['react-dom'],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
