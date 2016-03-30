// jquery, just the bits we're using. See
// http://alexomara.com/blog/webpack-and-jquery-include-only-the-parts-you-need/
var $ = require('jquery/src/core');
require('jquery/src/core/init');
require('jquery/src/manipulation');

require('!style!css!./style.css');
var content = require('./content.js');

$(function() {
  $('h1').html(content);
  console.log(content);
});
