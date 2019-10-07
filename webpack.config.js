const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/js/index.js'], //The input file
  output: {
    path: path.resolve(__dirname, 'dist'), //Where we want to output the budle
    filename: 'js/bundle.js' //What we want to call our bundle file
  },
  devServer: {
    contentBase: './dist' //The source of the bundled project from which the server will be streaming, usually dist since it contains the compiled project.
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    })
  ],
    module: {
      rules: [
        {
          test: /\.js$/, //This regular expression means that the loader will be scanning all .js files to convert them.
          exclude: /node_modules/, //Let's not convert the thousands of files in the node library
          use: {
            loader: 'babel-loader' //Apply loader to all test minus excludes
          }
        }
      ]
    }
};
