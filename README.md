# Webpack experiments

Let's use this repository to explore how we could use Webpack to solve
various common use-cases. See the to-do list at the end.





<!-- toc -->

* [Get started](#get-started)
* [Webpack watch and dev server](#webpack-watch-and-dev-server)
* [Build profiles](#build-profiles)
* [CSS](#css)
* [HTML](#html)
* [Sourcemaps](#sourcemaps)
* [jQuery](#jquery)
  * [Include just the bits you need](#include-just-the-bits-you-need)
* [To do](#to-do)

<!-- toc stop -->



## Get started

Build this with

```
npm install -g webpack
npm install
webpack
```

Verify that runs without errors, and bring up index.html in your browser.

To run a local server that watches for changes, and automatically reloads
the page:

```
npm run dev-server
```

Load the URL that it gives you in your browser. (See the next section for
info on how this works.)


## Webpack watch and dev server

Using the `--watch` option will start a webpack service, that watches for
file changes, and rebuilds the bundle:

```
webpack --watch
```

But that won't cause the browser page to auto-reload. To get
that behavior, install the webpack-dev-server:

```
npm install --save-dev webpack-dev-server
```

Then add this to your package.json, as one of the `scripts`:

```json
"dev-server": "webpack-dev-server"
```

Invoke it with:

```
npm run dev-server
```

## Build profiles

To have two profiles `dev` and `prod`, use the following code. This will give
`profile` a default value of `dev`, and allow it to be overridden with an
environment variable. Note that, in general, defaulting to `dev` is good so
that a new developer can clone and try out the module for the
first time, with minimal problems.

```javascript
// Support different build profiles, using an environment variable
var profile = process.env.BUILD_PROFILE || 'dev';

// Settings common to all profiles
var commonSettings = {
  ...
};

// Profile-specific settings
var profileSettings = {
  dev: {
    ...
  },
  prod: {
    ...
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
```

## CSS

You can include CSS files on your page just as though they were JavaScript
modules, by using `require`. These will use a distinct module loader, however.

Install them with:

```
npm install --save css-loader style-loader
```

There are two ways to specify to use these loaders for your CSS files.

1: Use the following special syntax in the `require` statement, and it
will just work, with no changes to the webpack config:

```javascript
require('!style!css!./style.css');
```

2: Add a rule in the `loaders` section of webpack config, to tell it
to always use the CSS style loader when certain conditions are met. So, in
your JS file, put this:

```javascript
require('./style.css');
```

And in your webpack.config.js, add this:

```javascript
loaders: [
  { test: /\.css$/, loader: "style!css" }
]
```

## HTML

Install this plugin:

```
npm install --save html-webpack-plugin
```

Then, add this to webpack.config.js, in the common settings:

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  }),
],
```

This will cause the ./src/index.html template to be processed and written
to dist. You can add template variables to it, but it might not even be
necessary. By default, webpack inserts the a script tag for the bundle, right
before the closing \<body> tag.

## Sourcemaps

This line in webpack.config.js causes sourcemaps to be created:

```
devtool: dev ? "inline-sourcemap" : null,
```

## jQuery

Add this to the project with:

```
npm install --save jquery
```

Then, include in your module with no fuss, no muss:

```javascript
var $ = require('jquery');
$(function() {
  ...
});
```

Some legacy libraries might depend on `jQuery` or `$` being in the global
scope. Or, you might want to have `$` available in the dev profile for
debugging. To accomplish this, add this plugin:

```
new webpack.ProvidePlugin({
  $: "jquery",
  jQuery: "jquery"
})
```

FIXME: what's an example of such a legacy library?

### Include just the bits you need

jQuery is pretty big, and with a little work, you can get the size that is
included in your bundle to be much smaller, by linking to the `src`, rather
than the default, which resolves to `dist`. (See [this blog
post](http://alexomara.com/blog/webpack-and-jquery-include-only-the-parts-you-need/)).

Install sizzle, which jQuery uses for its selectors:

```
npm install --save sizzle
npm install --save string-replace-loader
```

To fix a bug, add the following to webpack.config.js:

```javascript
module: {
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
```

Finally, in your modules that use jQuery, change the normal `require` to:

```javascript
// jquery, just the bits we're using. See
// http://alexomara.com/blog/webpack-and-jquery-include-only-the-parts-you-need/
var $ = require('jquery/src/core');
require('jquery/src/core/init');
require('jquery/src/manipulation');
```

## <a name='to-do'></a>To do

* Add an ES6 polyfill, whatwg-fetch, and use it to access github api,
  with whatwg-fetch -- basically, what this guy is doing at [about 7:15 in
  this video](https://youtu.be/NpMnRifyGyw?t=435)

* Continue to explore how to build a client-side *library*, as opposed to an
  app.
    * Declare dependencies, but don't bundle them in your dist
    * Or, probably: have at least two distributions, one with everything
      bundled, and one without
    * Figure out how this library could then be used:
        * From legacy web applications
        * As a dependency from another webpack-based project

* Try some more ES6 stuff: http://www.2ality.com/2015/04/webpack-es6.html