const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDotenv = require('dotenv-webpack');
const SveltePreprocess = require("svelte-preprocess");

module.exports = {
  mode: 'development',

  entry: ['./src/main.ts'],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },

  devtool: 'eval-cheap-module-source-map',

  module: {
    rules: [
      //Allows use of modern javascript
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/, //don't test node_modules folder
        use: {
          loader: 'babel-loader',
        },
      },
      //Allows use of svelte
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            compilerOptions: {
              dev: true
            },
            hotReload: true,
            preprocess: SveltePreprocess({})
          }
        },
      },
      //Allows use of CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      //Allows use of images
      {
        test: /\.(jpg|jpeg|png|svg)$/,
        type: 'asset/resource'
      },
    ],
  },

  //this is what enables users to leave off the extension when importing
  resolve: {
    extensions: ['.mjs', '.js', '.svelte', '.ts'],
  },

  plugins: [
    //Allows to create an index.html in our build folder 
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    //take our environment variable in .env file
    //And it does a text replace in the resulting bundle for any instances of process.env.
    new WebpackDotenv(),
  ],

  ////Config for webpack-dev-server module
  devServer: {
    port: 8088,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true
  },
};