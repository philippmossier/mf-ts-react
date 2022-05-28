```
mkdir mf-ts-react && cd $_ && npm init -y && npm i concurrently && \
touch .gitignore && echo "node_modules\ndist/" > .gitignore && \
mkdir app1 app2 app3 && \
\
cd app1 && npm init -y && npm install react react-dom && \
npm install -D typescript @types/react @types/react-dom \
webpack webpack-cli webpack-dev-server html-webpack-plugin serve \
@babel/core @babel/preset-react @babel/preset-typescript babel-loader \
style-loader css-loader && \
mkdir src public && \
touch src/App.tsx src/bootstrap.tsx src/index.tsx src remoteTypes.d.ts.ts \
webpack.config.js tsconfig.json ./public/index.html && \
\
cd ../app2 && npm init -y && npm install react react-dom && \
npm install -D typescript @types/react @types/react-dom \
webpack webpack-cli webpack-dev-server html-webpack-plugin serve \
@babel/core @babel/preset-react @babel/preset-typescript babel-loader && \
mkdir src public && \
touch src/App.tsx src/bootstrap.tsx src/index.tsx src \
webpack.config.js tsconfig.json ./public/index.html && \
\
cd ../app3 && npm init -y && npm install react react-dom && \
npm install -D typescript @types/react @types/react-dom \
webpack webpack-cli webpack-dev-server html-webpack-plugin serve \
@babel/core @babel/preset-react @babel/preset-typescript babel-loader && \
mkdir src public && \
touch src/App.tsx src/bootstrap.tsx src/index.tsx src \
webpack.config.js tsconfig.json ./public/index.html
```

*Add this scripts for all apps (ports: app1-3001,app2-3002,app3-3003)*
```package.json
"scripts": {
"start": "webpack-cli serve",
"build": "webpack --mode production",
"serve": "serve dist -p 3001",
"clean": "rm -rf dist"
},
```

*Add webpack-config for host app (app1) and define remotes*
```webpack.config.js
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PACKAGE = require('./package.json');
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3001,
    open: true,
  },
  output: {
    publicPath: 'auto',
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
        "react-dom": { singleton: true, eager: true, requiredVersion: PACKAGE.dependencies["react-dom"] }
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
```






### ------ Explanations -------------
```
react — I’m sure you know what React is
react-dom — Provides DOM-specific methods for the browser
react-router-dom — Provides routing capabilities to React for the browser
@babel/core — Core dependencies for Babel
Babel is a transpiler that compiles JavaScript ES6 to JavaScript ES5 allowing you to write JavaScript “from the future” so that current browsers will understand it. Detailed description in Quora.
babel-loader — This package allows transpiling JavaScript files using Babel and webpack
@babel/preset-env — With this you don’t have to specify if you will be writing ES2015, ES2016 or ES2017. Babel will automatically detect and transpile accordingly.
@babel/preset-react — Tells Babel we will be using React
@babel/preset-typescript — Tells Babel we will be using Typescript
css-loader — Interprets @import and url() like import/require() and will resolve them
html-webpack-plugin — Can generate an HTML file for your application, or you can provide a template
style-loader — Adds CSS to the DOM by injecting a <style> tag
webpack — Module bundler
webpack-cli — Command Line Interface, needed for Webpack 4.0.1 and latest
webpack-dev-server — Provides a development server for your application
```