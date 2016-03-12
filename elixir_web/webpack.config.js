var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    "index.js": "./app/js/index.js",
    "style.css": "./app/styles/style.less"
  },
  output: {
    path: "./dist/",
    filename: "[name]",
    chunkFilename: "[id].js"
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test:   /\.md/,
        loader: 'html!markdown'
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react', 'es2015']
        }
      }, 
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      },
      { test: /\.(gif|png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
  plugins: [
        new ExtractTextPlugin("./css/[name]")
  ],
  'markdown-it': {
    preset: 'default',
    typographer: true
  }
};