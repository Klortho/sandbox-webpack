# webpack fun

Next up, to figure out: how to include jquery, such that it is
excluded from the pre-built bundle. I think I need to follow
this tutorial: [webpack and jquery: include only the parts you 
need](http://alexomara.com/blog/webpack-and-jquery-include-only-the-parts-you-need/).

## Get started

Build this with

```
npm install -g webpack
npm install
webpack
```

Then, bring up index.html in your browser.

In your terminal, do this, so that changes to files cause the bundle to be
rebuilt automatically:

```
webpack --watch
```

Note that this won't cause auto-reload in the browser. To get
that, you have to use webpack-dev-server.


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
modules, by using `require`. These will use a distinct module loader, however,
and there are two ways to specify it. 

You can use this special syntax in the `require` statement, and it will just
work, with no changes to the webpack config:

```javascript
require('!style!css!./style.css');
```

Or, you can add a rule in the `loaders` section of webpack config, to tell it
to always use the CSS style loader when certain conditions are met. So, in
your JS file:

```javascript
require('./style.css');
```

And add this into webpack.config.js:

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

So that jQuery will be added automatically whenever webpack sees
`$` in the global context, you can add this:

```
plugins: [
  ...
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  })
]
```

Note that I don't know what this buys you, really. It seems to me it
would be better to always have a `require` whenever you're using a
module like jquery. The above plugin does not, for example, put `$`
into the global scope, or cause jQuery to be excluded from the built
bundle.
