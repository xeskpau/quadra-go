const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed || {};

// Prepare environment variables for DefinePlugin
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

// Always include NODE_ENV and CI
envKeys['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV || 'development');
envKeys['process.env.CI'] = JSON.stringify(process.env.CI || 'false');

// Log environment variables in CI for debugging (without sensitive values)
if (process.env.CI) {
  console.log('Webpack environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    CI: process.env.CI,
    hasReactAppFirebaseApiKey: !!env.REACT_APP_FIREBASE_API_KEY,
    hasReactAppFirebaseAuthDomain: !!env.REACT_APP_FIREBASE_AUTH_DOMAIN
  });
}

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false,
            compilerOptions: {
              noEmit: false
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true
    }),
    new webpack.DefinePlugin(envKeys)
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    hot: true,
    open: true,
  },
}; 