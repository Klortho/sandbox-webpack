# webpack fun

## Get started

Build this with

```
npm install -g webpack
npm install
webpack
```

Verify that runs without errors, and bring up index.html in your browser.

To run a local server that watches for changes, and automatically reloads
the page.

```
npm run dev-server
```

That will give you a localhost:8080 URL; load that in your browser.
See the next section, Webpack watch and dev server, for info on how this is 
set up.


## Webpack watch and dev server

Using the `--watch` option will start a webpack service, that watches for 
file changes, and rebuilds the bundle:

```
webpack --watch
```

But this won't cause the browser page to auto-reload. To get
that, install webpack-dev-server as a dev dependency:

```
npm install --save-dev webpack-dev-server
```

Then add this to your package.json, as one of the `scripts`:

```json
"dev-server": "webpack-dev-server"
```

With that, you can invoke the dev server with

```
npm run dev-server
```



## Build profiles

To distinguish between `dev` and `prod`, use the following. Note that it should
default to `dev`, so that someone cloning and trying out this module for the
first time has no problem getting started.

```javascript
var env = process.env.BUILD_PROFILE || 'dev';
// If you need a flag for a specific profile:
var dev = env == 'dev';
```


## CSS

You can include CSS files on your page just as though they were JavaScript
modules, by using `require`. These will use a distinct module loader, however.

Install them with:

```
npm install --save-dev css-loader style-loader
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








