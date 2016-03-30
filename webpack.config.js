var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var _ = require('lodash');

// Support different build profiles, using an environment variable
var profile = process.env.BUILD_PROFILE || 'dev';


// Settings common to all profiles
var commonSettings = {
  context: __dirname,
  entry: "./src/main.js",
  output: {
    path: __dirname + '/dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],
  module: {
    // If we want to load CSS files without any special syntax in the require
    // statements, then you can add this:
    //loaders: [
    //  { test: /\.css$/, loader: "style!css" }
    //]

    // This hack is needed to get around a bug in jquery's src distribution.
    // See http://stackoverflow.com/a/35880094/1311716
    preLoaders: [
      { loader: 'string-replace',
        test: /jquery\/src\/selector-sizzle\.js$/,
        query: {
          search: '../external/sizzle/dist/sizzle',
          replace: 'sizzle'
        }
      }
    ],
  },
};

// Profile-specific settings
var profileSettings = {
  dev: {
    output: {
      filename: 'bundle.js',
    },
    devtool: 'inline-sourcemap',
    plugins: [
      // Put jQuery into the global scope (as `$`) in the dev profile.
      // Note that you don't need this to use jQuery.
      //new webpack.ProvidePlugin({
      //  $: "jquery",
      //  jQuery: "jquery"
      //})
    ],
  },
  prod: {
    output: {
      filename: 'bundle.min.js',
    },
    plugins: [
      //new webpack.optimize.DedupePlugin(),
      //new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        mangle: false, sourcemap: false
      }),
    ]
  }
}[profile];   // select this profile's

// Merge common and profile to get the actual settings. The customizer makes
// sure that arrays are merged by concatenation.

module.exports =
  _.mergeWith(commonSettings, profileSettings,
    function customizer(objValue, srcValue) {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });


console.log(module.exports);

