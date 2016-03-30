var webpack = require('webpack');

// Support different build profiles, using environment variable
var env = process.env.BUILD_PROFILE || 'dev';
var dev = env == 'dev';

// Different plugins for each environment
var envPlugins = {
  dev: [
    // You don't need this to use jQuery; this is just to put jQuery
    // (as `$`) into the global scope, in the dev environment.
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  prod: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ]
};
// Put common ones here
var commonPlugins = [];
// The final list
var plugins = commonPlugins.concat(envPlugins[env]);

module.exports = {
  context: __dirname,
  devtool: dev ? "inline-sourcemap" : null,
  entry: "./entry.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    // If we want to load CSS files without any special syntax in the require
    // statements, then you can add this:
    //loaders: [
    //  { test: /\.css$/, loader: "style!css" }
    //]
  },
  plugins: plugins,
};


